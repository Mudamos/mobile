import { call, put, select, spawn, takeLatest, takeEvery } from "redux-saga/effects";

import {
  creatingWallet,
  createWalletError,
  profileStateMachine,
  updatedUserProfile,
  walletAvailable,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  currentUser,
} from "../selectors";

import {
  isDev,
  isUnauthorized,
  log,
  logError,
} from "../utils";

import { User } from "../models";


function* createWallet({ mobileApi, walletStore }) {
  yield takeLatest("WALLET_CREATE", function* ({ payload }) {
    try {
      yield put(creatingWallet(true));

      const valid = yield call(validateLocalWallet, { walletStore });

      if (!valid) {
        if (isDev) console.log("Will create new wallet");

        const user = yield select(currentUser);
        const seed = yield call(walletStore.create, user.voteCard);

        const authToken = yield select(currentAuthToken);
        const response = yield call(mobileApi.saveWallet, authToken, seed.publicKey);
        const newUser = User.fromJson(response.user);

        yield put(updatedUserProfile({ user: newUser }));
      } else {
        if (isDev) console.log("Valid seed");
      }

      yield put(creatingWallet(false));
      yield put(walletAvailable(true));
      yield put(profileStateMachine(payload));
    } catch (e) {
      logError(e, { tag: "createWallet"});

      yield call(walletStore.destroy);
      yield put(creatingWallet(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(createWalletError(e));
    }
  });
}

export function* validateLocalWallet({ walletStore }) {
  const user = yield select(currentUser);
  const valid = user && (yield call(walletStore.valid, user.voteCard));

  if (isDev) console.log("Is local wallet valid?", valid);

  if (!valid) yield call(walletStore.destroy);
  yield put(walletAvailable(valid));

  return valid;
}

function* hasLocalWallet({ walletStore }) {
  yield takeEvery("WALLET_HAS_LOCAL", function* () {
    const hasWallet = yield call(walletStore.exists);
    yield put(walletAvailable(hasWallet));
  });
}

function* invalidateWallet({ walletStore }) {
  yield takeEvery("PROFILE_INVALIDATE_PHONE", function* () {
    try {
      log("Will invalidate wallet");
      yield call(walletStore.destroy);
      log("Wallet invalidated");
    } catch (e) {
      logError(e, { tag: "invalidateWallet" });
    }
  });
}


export default function* walletSaga({ mobileApi, walletStore }) {
  yield spawn(createWallet, { mobileApi, walletStore });
  yield spawn(hasLocalWallet, { walletStore });
  yield spawn(invalidateWallet, { walletStore });
}
