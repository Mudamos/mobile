import { takeLatest } from "redux-saga";
import { call, spawn, put, select } from "redux-saga/effects";

import { isDev, logError, moment } from "../utils";

import {
  fetchPlips as fetchPlipsAction,
  isSigningPlip,
  navigate,
  plipsFetched,
  plipsFetchError,
  plipSignError,
  plipUserSignInfo,
} from "../actions";

import {
  currentAuthToken,
} from "../selectors";

import { fetchProfile } from "./profile";
import { profileScreenForCurrentUser } from "./navigation";

import LibCrypto from "mudamos-libcrypto";

const buildSignMessage = ({ user, plip }) => [
  user.name,
  user.zipCode,
  user.voteCard,
  moment().toISOString(),
  plip.cycle.name,
  plip.id,
].join(";");

export function* fetchPlips({ mudamosWebApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      const plips = yield call(mudamosWebApi.listPlips);
      yield put(plipsFetched(plips));
    } catch(e) {
      yield put(plipsFetchError(e));
    }
  });
}

function* signPlip({ mobileApi, walletStore }) {
  yield takeLatest("PLIP_SIGN", function* ({ payload }) {
    try {
      const { plip } = payload;

      yield put(isSigningPlip(true));

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) return yield put(navigate("signIn"));

      // Check profile completion
      const { key: screenKey, ...screenArgs } = yield call(profileScreenForCurrentUser);

      if (screenKey !== "showPlip") return yield put(navigate(screenKey, screenArgs));

      const authToken = yield select(currentAuthToken);

      const difficulty = yield call(mobileApi.difficulty, authToken);
      const seed = yield call(walletStore.retrieve, user.voteCard);
      const message = buildSignMessage({ user, plip });
      const result = LibCrypto.signMessage(seed, message, difficulty);

      if (isDev) console.log("Sign result:", result);

      const apiResult = yield call(mobileApi.signPlip, authToken, {
        petitionId: plip.id,
        walletKey: user.wallet.key,
        message,
      });

      if (isDev) console.log("Sign api result:", apiResult);

      yield put(plipUserSignInfo({ plipId: plip.id, info: apiResult.signMessage }));
    } catch(e) {
      logError(e);

      yield put(plipSignError(e));
    } finally {
      yield put(isSigningPlip(false));
    }
  });
}

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore }) {
  yield spawn(fetchPlips, { mudamosWebApi });
  yield spawn(signPlip, { mobileApi, walletStore });

  yield put(fetchPlipsAction());
}
