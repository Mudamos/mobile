import { takeLatest } from "redux-saga";
import { call, put, select, spawn } from "redux-saga/effects";

import {
  creatingWallet,
  createWalletError,
  profileStateMachine,
  walletAvailable,
} from "../actions";

import {
  currentUser,
} from "../selectors";

import {
  isDev,
  logError,
} from "../utils";


// eslint-disable-next-line no-unused-vars
function* createWallet({ mobileApi, walletStore }) {
  yield takeLatest("WALLET_CREATE", function* () {
    try {
      yield put(creatingWallet(true));

      const user = yield select(currentUser);
      const valid = yield call(walletStore.valid, user.voteCard);

      if (!valid) {
        yield call(walletStore.create, user.voteCard);
      } else {
        if (isDev) console.log("Valid seed");
      }

      yield put(creatingWallet(false));
      yield put(walletAvailable(true));
      yield put(profileStateMachine());
    } catch (e) {
      logError(e, { tag: "createWallet"});

      yield call(walletStore.destroy);
      yield put(creatingWallet(false));
      yield put(createWalletError(e));
    }
  });
}


export default function* walletSaga({ mobileApi, walletStore }) {
  yield spawn(createWallet, { mobileApi, walletStore });
}
