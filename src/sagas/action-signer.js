import { delay } from "redux-saga";
import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";
import LibCrypto from "mudamos-libcrypto";
import { URLSearchParams } from "react-native-url-polyfill";
import Toast from "react-native-simple-toast";
import { Buffer } from "buffer";

import { includes, nth, pipe, split } from "ramda";

import {
  actionSignerError,
  actionSignerIntegratorError,
  actionSignerReset,
  actionSignerSuccess,
  actionSignerSetUrl,
  appLinkReset,
  navigate,
  navigateBack,
  profileStateMachine,
  unauthorized,
  invalidatePhone,
} from "../actions";

import {
  actionSignerResult,
  currentAuthToken,
  isUserLoggedIn,
  isProfileComplete,
  currentScreenKey,
} from "../selectors";

import { SCREEN_KEYS, SCREEN_NAVIGATION_TYPES } from "../models";

import locale from "../locales/pt-BR";
import { isDev, isUnauthorized, moment, log, logError } from "../utils";

import { fetchProfile } from "./profile";
import { validateLocalWallet } from "./wallet";

const buildMessage = ({ message, timestamp }) => [message, timestamp].join(";");

const signature = pipe(split(";"), nth(-2));

function* navigateBackWithDelay(delayTimeout = 1) {
  yield put(navigateBack());
  // This allow the back action to be processed before continuing
  // Avoids changing screen later on and having issues with multiple screen navigations in sequence
  if (delayTimeout) yield call(delay, delayTimeout);
}

function* signMessage({ mobileApi, mudamosSigner, walletStore }) {
  yield takeLatest("ACTION_SIGNER_SIGN_MESSAGE", function* () {
    try {
      const isLoggedIn = yield select(isUserLoggedIn);
      if (!isLoggedIn) {
        return yield put(actionSignerError({ message: "user-not-logged-in" }));
      }

      const user = yield call(fetchProfile, { mobileApi });
      if (!user) return;

      if (!user.voteCard) {
        return yield put(actionSignerError({ message: "incomplete-profile" }));
      }

      const validWallet = yield call(validateLocalWallet, { walletStore });
      if (!validWallet) {
        return yield put(actionSignerError({ message: "invalid-wallet" }));
      }

      if (!(yield select(isProfileComplete))) {
        return yield put(actionSignerError({ message: "incomplete-profile" }));
      }

      const [seed, difficulty, { message: userMessage }] = yield all([
        call(walletStore.retrieve, user.voteCard),
        call(mobileApi.difficulty),
        call(mudamosSigner.data),
      ]);

      if (!userMessage) {
        return yield put(actionSignerError({ message: "invalid-payload" }));
      }

      const timestamp = moment().toISOString();
      const message = buildMessage({ message: userMessage, timestamp });
      const block = yield call(
        [LibCrypto, LibCrypto.signMessage],
        seed,
        message,
        difficulty,
      );

      if (isDev) {
        console.log("Block:", block);
      }

      const authToken = yield select(currentAuthToken);

      const { publicKey } = yield call(mobileApi.signMessage, authToken, {
        message: block,
      });

      yield put(
        actionSignerSuccess({
          message,
          signature: signature(block),
          timestamp,
          publicKey,
        }),
      );
    } catch (e) {
      if (isUnauthorized(e)) {
        return yield put(actionSignerError({ message: "user-not-logged-in" }));
      }

      yield put(
        actionSignerError({
          message: e.userMessage || "unknown-error",
        }),
      );
    }
  });
}

function* closeActionSigner({ mudamosSigner }) {
  function* exit() {
    const result = yield select(actionSignerResult);
    yield call(mudamosSigner.done, result);

    yield put(actionSignerReset());
  }

  yield takeLatest("ACTION_SIGNER_SIGN_SUCCESS", function* () {
    yield call(delay, 1500);
    yield call(exit);
  });

  yield takeLatest("ACTION_SIGNER_SIGN_ERROR", function* () {
    yield call(delay, 4000);
    yield call(exit);
  });
}

function* navigateToMissingScreen() {
  return yield put(profileStateMachine({ type: "reset" }));
}

function* afterSignInSignMessageWithUrl({ mobileApi, url, walletStore }) {
  yield takeLatest("ACTION_SIGNER_PROCEED_SIGN_MESSAGE", function* ({
    payload: { url },
  }) {
    yield call(signMessageWithUrl, { mobileApi, url, walletStore });
  });
}

export function* signMessageWithUrl({ mobileApi, url, walletStore }) {
  try {
    log("Raw url:", { tag: "signMessageWithUrl" }, url);

    // Allow navigation actions to be processed before
    yield call(delay, 1);

    const params = new URLSearchParams(url.search);
    const encodedUserMessage = params.get("message");
    const userMessage = Buffer.from(encodedUserMessage, "hex").toString(
      "utf-8",
    );
    const signature = params.get("signature");
    const appId = params.get("appid");

    yield put(appLinkReset());

    log(
      "sign link params",
      { tag: "signMessageWithUrl" },
      { message: userMessage, signature, url, encodedUserMessage },
    );

    if (!appId || !signature || !userMessage) {
      return yield call(
        [Toast, Toast.show],
        locale.signLinkErrors.invalidContent,
      );
    }

    yield put(actionSignerReset());

    const currentScreen = yield select(currentScreenKey);
    const navigationOptions = includes(currentScreen, [
      SCREEN_KEYS.MESSAGE_SIGN_SUCCESS,
      SCREEN_KEYS.SCANNER,
    ])
      ? {
          type: SCREEN_NAVIGATION_TYPES.replace,
        }
      : {};
    yield put(navigate(SCREEN_KEYS.MESSAGE_SIGN, navigationOptions));

    yield put(actionSignerSetUrl({ url }));

    const isLoggedIn = yield select(isUserLoggedIn);
    if (!isLoggedIn) {
      yield call(navigateBackWithDelay);
      return yield put(navigate(SCREEN_KEYS.SIGN_IN));
    }

    const user = yield call(fetchProfile, { mobileApi, force: true });
    if (!user) {
      yield call(navigateBackWithDelay);
      return yield put(navigate(SCREEN_KEYS.SIGN_IN));
    }

    if (!user.voteCard) {
      return yield call(navigateToMissingScreen);
    }

    const publicKey = yield call(walletStore.publicKey, user.voteCard);
    log(`User public key: ${publicKey}`, { tag: "signMessageWithUrl" });

    if (!publicKey || publicKey !== user.wallet.key || !user.wallet.status) {
      log("Public key does not match", { tag: "signMessageWithUrl" });
      yield put(invalidatePhone());
      yield call(navigateBackWithDelay);
      return yield call(navigateToMissingScreen);
    }

    const validWallet = yield call(validateLocalWallet, { walletStore });
    if (!validWallet) {
      log("LocalWallet is invalid", { tag: "signMessageWithUrl" });
      yield put(invalidatePhone());
      yield call(navigateBackWithDelay);
      return yield call(navigateToMissingScreen);
    }

    if (!(yield select(isProfileComplete))) {
      log("Profile is incomplete", { tag: "signMessageWithUrl" });
      yield call(navigateBackWithDelay);
      return yield call(navigateToMissingScreen);
    }

    const [seed, difficulty] = yield all([
      call(walletStore.retrieve, user.voteCard),
      call(mobileApi.difficulty),
    ]);

    const timestamp = moment().toISOString();
    const message = buildMessage({ message: userMessage, timestamp });
    log(`Full message being signed: ${message}`);

    const block = yield call(
      [LibCrypto, LibCrypto.signMessage],
      seed,
      message,
      difficulty,
    );

    log("wallet signed message block:", {}, block);

    const authToken = yield select(currentAuthToken);

    yield call(mobileApi.signMessage, authToken, {
      message: block,
      integrator: { appId, signature },
    });

    yield put(actionSignerReset());
    yield put(navigate(SCREEN_KEYS.MESSAGE_SIGN_SUCCESS));
  } catch (e) {
    logError(e);

    if (isUnauthorized(e)) return yield put(unauthorized());

    const error = {
      userMessage: locale.actionSignerError[e.userMessage || "unknown-error"],
    };

    const screen = yield select(currentScreenKey);

    if (screen === SCREEN_KEYS.MESSAGE_SIGN) {
      yield put(actionSignerIntegratorError(error.userMessage));
    } else {
      yield call([Toast, Toast.show], locale.signLinkErrors.processError);
    }
  }
}

export default function* actionSigner({
  mobileApi,
  mudamosSigner,
  walletStore,
}) {
  yield fork(signMessage, { mobileApi, mudamosSigner, walletStore });
  yield fork(afterSignInSignMessageWithUrl, {
    mobileApi,
    mudamosSigner,
    walletStore,
  });
  yield fork(closeActionSigner, { mudamosSigner });
}
