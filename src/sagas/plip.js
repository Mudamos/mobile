import { takeLatest } from "redux-saga";
import { call, spawn, put, select } from "redux-saga/effects";

import { logError } from "../utils";

import {
  fetchPlips as fetchPlipsAction,
  isSigningPlip,
  navigate,
  plipsFetched,
  plipsFetchError,
  plipSignError,
} from "../actions";

import {
  currentAuthToken,
} from "../selectors";

import { fetchProfile } from "./profile";
import { profileScreenForCurrentUser } from "./navigation";

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

function* signPlip({ mobileApi }) {
  yield takeLatest("PLIP_SIGN", function* () {
    try {
      yield put(isSigningPlip(true));

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) return yield put(navigate("signIn"));

      // Check profile completion
      const { key: screenKey, ...screenArgs } = yield call(profileScreenForCurrentUser);

      if (screenKey !== "showPlip") return yield put(navigate(screenKey, screenArgs));

      const authToken = yield select(currentAuthToken);
      const difficulty = yield call(mobileApi.difficulty, authToken);
      console.log("Sign difficulty:", difficulty);
    } catch(e) {
      logError(e);

      yield put(plipSignError(e));
    } finally {
      yield put(isSigningPlip(false));
    }
  });
}

export default function* plipSaga({ mobileApi, mudamosWebApi }) {
  yield spawn(fetchPlips, { mudamosWebApi });
  yield spawn(signPlip, { mobileApi });

  yield put(fetchPlipsAction());
}
