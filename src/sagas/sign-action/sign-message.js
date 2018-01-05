import { takeLatest } from "redux-saga";
import { delay } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { NativeModules } from "react-native";

import moment from "moment";
import LibCrypto from "mudamos-libcrypto";
import {
  isDev,
  logError,
} from "../../utils";

import {
  currentAuthToken,
  isProfileComplete,
  isUserLoggedIn,
} from "../../selectors";

import { fetchProfile } from "../profile";
import { validateLocalWallet } from "../wallet";
import { fetchSession } from "../session";

const buildMessage = ({ appInput, timestamp }) => [
  appInput,
  timestamp,
].join(";");

function* signError({ message }) {
  yield put({
    type: "SIGNER_ERROR",
    payload: {
      message,
    },
  });
}

function* getUser({ mobileApi }) {
  try {
    return yield call(fetchProfile, { mobileApi });
  } catch(_e) {
    return;
  }
}

function* sign({ mobileApi, sessionStore, walletStore }) {
  yield takeLatest("SIGNER_SIGN_MESSAGE", function* () {
    try {
      yield call(fetchSession, { sessionStore });

      const loggedIn = yield select(isUserLoggedIn);
      if (!loggedIn) {
        return yield call(signError, {
          message: "User is not logged in",
        });
      }

      const user = yield call(getUser, { mobileApi });
      if (!user) {
        return yield call(signError, {
          message: "User is unathorized",
        });
      }

      const validWallet = yield call(validateLocalWallet, { walletStore });
      if (!validWallet) {
        return yield call(signError, {
          message: "Wallet is invalid",
        });
      }

      if (!(yield select(isProfileComplete))) {
        return yield call(signError, {
          message: "Profile is not complete",
        });
      }

      const [seed, difficulty] = yield [
        call(walletStore.retrieve, user.voteCard),
        call(mobileApi.difficulty),
      ];

      const appInputData = yield call(NativeModules.SignerAction.data);
      if (isDev) {
        console.log("Input data:", appInputData);
      }

      const { message: appInput } = appInputData;
      if (!appInput) {
        return yield call(signError, {
          message: `Invalid message sent to sign ${JSON.stringify(appInputData)}`,
        });
      }

      const timestamp = moment().toISOString();
      const message = buildMessage({ appInput, timestamp });
      const block = yield call([LibCrypto, LibCrypto.signMessage], seed, message, difficulty);

      if (isDev) {
        console.log("Block:", block);
      }

      const authToken = yield select(currentAuthToken);

      const { publicKey } = yield mobileApi.signMessage(authToken, {
        message: block,
      });

      yield put({
        type: "SIGNER_SUCCESS",
        payload: {
          message: "Sign success",
          signedMessage: message,
          timestamp,
          publicKey,
        },
      });

      yield call(delay, 1000);
      yield put({ type: "SIGNER_CLOSE_APP" });

     // yield call(delay, 100);
     // // TODO: go back to the calling app
    } catch(e) {
      logError(e);

      yield call(signError, {
        message: e.userMessage ? e.userMessage : e.message,
      });
    }
  });
}

export default function* signMessage({ mobileApi, sessionStore, walletStore }) {
  yield fork(sign, { mobileApi, sessionStore, walletStore });
}
