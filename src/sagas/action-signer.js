import { delay, takeLatest } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import LibCrypto from "mudamos-libcrypto";

import {
  nth,
  pipe,
  split,
} from "ramda";

import {
  actionSignerError,
  ationSignerReset,
  actionSignerSuccess,
} from "../actions";

import {
  actionSignerResult,
  currentAuthToken,
  isUserLoggedIn,
  isProfileComplete,
} from "../selectors";

import { isDev, isUnauthorized, moment } from "../utils";

import { fetchProfile } from "./profile";
import { validateLocalWallet } from "./wallet";

const buildMessage = ({ message, timestamp }) => [
  message,
  timestamp,
].join(";");

const signature = pipe(split(";"), nth(3));

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

      const [seed, difficulty, { message: userMessage }] = yield [
        call(walletStore.retrieve, user.voteCard),
        call(mobileApi.difficulty),
        call(mudamosSigner.data),
      ];

      if (!userMessage) {
        return yield put(actionSignerError({ message: "invalid-payload" }));
      }

      const timestamp = moment().toISOString();
      const message = buildMessage({ message: userMessage, timestamp });
      const block = yield call([LibCrypto, LibCrypto.signMessage], seed, message, difficulty);

      if (isDev) {
        console.log("Block:", block);
      }

      const authToken = yield select(currentAuthToken);

      const { publicKey } = yield call(mobileApi.signMessage, authToken, {
        message: block,
      });

      yield put(actionSignerSuccess({
        message,
        signature: signature(block),
        timestamp,
        publicKey,
      }));
    } catch(e) {
      if (isUnauthorized(e)) {
        return yield put(actionSignerError({ message: "user-not-logged-in" }));
      }

      yield put(actionSignerError({
        message: e.userMessage || "unknown-error",
      }));
    }
  });
}

function* closeActionSigner({ mudamosSigner }) {
  const actions = [
    "ACTION_SIGNER_SIGN_ERROR",
    "ACTION_SIGNER_SIGN_SUCCESS",
  ];

  yield takeLatest(actions, function* () {
    yield call(delay, 2000);

    const result = yield select(actionSignerResult);
    yield call(mudamosSigner.done, result);

    yield call(delay, 500);
    yield put(ationSignerReset());
  });
}

export default function* actionSigner({ mobileApi, mudamosSigner, walletStore }) {
  yield fork(signMessage, { mobileApi, mudamosSigner, walletStore });
  yield fork(closeActionSigner, { mudamosSigner });
}
