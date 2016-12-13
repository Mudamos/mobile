import { takeLatest } from "redux-saga";
import { call, put, spawn } from "redux-saga/effects";

import {
  creatingWallet,
  createWalletError,
} from "../actions";

import { logError } from "../utils";


// eslint-disable-next-line no-unused-vars
function* createWallet({ deviceInfo, mobileApi }) {
  yield takeLatest("WALLET_CREATE", function* () {
    try {
      yield put(creatingWallet(true));

      const info = yield call(deviceInfo.info);
      console.log("Device info: ", info.toString());

      yield put(creatingWallet(false));
    } catch (e) {
      logError(e);

      yield put(creatingWallet(false));
      yield put(createWalletError(e));
    }
  });
}


export default function* walletSaga({ deviceInfo, mobileApi }) {
  yield spawn(createWallet, { deviceInfo, mobileApi });
}
