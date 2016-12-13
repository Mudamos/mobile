import { takeLatest } from "redux-saga";
import { call, put, select, spawn } from "redux-saga/effects";

import {
  creatingWallet,
  createWalletError,
} from "../actions";

import {
  currentUser,
} from "../selectors";

import {
  isDev,
  logError,
  moment,
} from "../utils";

import LibCrypto from "mudamos-libcrypto";

const LANG = "BRAZILIAN-PORTUGUESE";


// eslint-disable-next-line no-unused-vars
function* createWallet({ deviceInfo, mobileApi, walletStore }) {
  yield takeLatest("WALLET_CREATE", function* () {
    try {
      yield put(creatingWallet(true));

      const info = yield call(deviceInfo.info);
      if (isDev) console.log("Device info:", info);

      const entropy = [
        info.toString(),
        moment().toISOString(),
      ].join(";");

      const seed = LibCrypto.createSeedAndWallet(LANG, entropy);
      if (isDev) console.log("Seed:", seed);

      const user = yield select(currentUser);
      //const user = { voteCard: "123412341234" };

      yield call(walletStore.persist, seed.seed, user.voteCard);

      yield put(creatingWallet(false));
    } catch (e) {
      logError(e);

      yield call(walletStore.destroy);
      yield put(creatingWallet(false));
      yield put(createWalletError(e));
    }
  });
}


export default function* walletSaga({ deviceInfo, mobileApi, walletStore }) {
  yield spawn(createWallet, { deviceInfo, mobileApi, walletStore });
}
