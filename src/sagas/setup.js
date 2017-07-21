import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  appSetup,
  fetchIsUserFirstTime,
  fetchFeatureToggles,
  fetchRemoteLinks,
  fetchRemoteConfig,
  fetchProfile,
  fetchPlips,
} from "../actions";

import { fetchSession } from "./session";

function* setup({ sessionStore }) {
  yield takeLatest("SETUP", function* () {
    yield call(fetchSession, { sessionStore });

    yield [
      put(fetchIsUserFirstTime()),
      put(fetchFeatureToggles()),
      put(fetchRemoteLinks()),
      put(fetchRemoteConfig()),
      put(fetchProfile()),
      put(fetchPlips()),
    ];
  });
}
export default function* setupSaga({ sessionStore }) {
  yield fork(setup, { sessionStore });

  yield put(appSetup());
}
