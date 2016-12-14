import { takeLatest, takeEvery } from "redux-saga";
import { call, put, select, spawn } from "redux-saga/effects";

import {
  creatingWallet,
  createWalletError,
  profileStateMachine,
  updatedUserProfile,
  walletAvailable,
} from "../actions";

import {
  currentAuthToken,
  currentUser,
} from "../selectors";

import {
  isDev,
  logError,
} from "../utils";

import { User } from "../models";


// eslint-disable-next-line no-unused-vars
function* createWallet({ mobileApi, walletStore }) {
  yield takeLatest("WALLET_CREATE", function* () {
    try {
      yield put(creatingWallet(true));

      const user = yield select(currentUser);
      const valid = yield call(walletStore.valid, user.voteCard);

      if (!valid) {
        const seed = yield call(walletStore.create, user.voteCard);

        const authToken = yield select(currentAuthToken);
        const response = yield call(mobileApi.saveWallet, authToken, seed.publicKey);
        const newUser = User.fromJson(response.user);

        yield put(updatedUserProfile({ user: newUser, profileComplete: response.complete }));
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

function* hasLocalWallet({ walletStore }) {
  yield takeEvery("WALLET_HAS_LOCAL", function* () {
    const hasWallet = yield call(walletStore.exists);
    yield put(walletAvailable(hasWallet));
  });
}


export default function* walletSaga({ mobileApi, walletStore }) {
  yield spawn(createWallet, { mobileApi, walletStore });
  yield spawn(hasLocalWallet, { walletStore });
}
