import { takeLatest } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { NativeModules } from "react-native";

import {
  appSetup,
  fetchIsUserFirstTime,
  fetchFeatureToggles,
  fetchRemoteLinks,
  fetchRemoteConfig,
  fetchProfile,
  fetchPlips,
} from "../actions";

import { wasMainAppSetupInitiated } from "../selectors";

import { fetchSession } from "./session";

function* setup({ sessionStore }) {
  yield takeLatest("SETUP", function* () {
    const data = yield call(NativeModules.SignerAction.data);
    // check if it the app is being launched by the android action extension
    if (data && data.activityName === "SignerActivity") return;

    yield call(fetchSession, { sessionStore });

    yield [
      put(fetchIsUserFirstTime()),
      put(fetchFeatureToggles()),
      put(fetchRemoteLinks()),
      put(fetchRemoteConfig()),
      put(fetchProfile()),
      put(fetchPlips()),
      put({ type: "APP_SETUP_INITIATED" }),
    ];
  });
}
export default function* setupSaga({ sessionStore }) {
  yield fork(setup, { sessionStore });

  // If the app was started because of an action
  // the setup process was halted, so we need to initiated the app again
  yield takeLatest("APP_ON_FOREGROUND", function* () {
    const initiated = yield select(wasMainAppSetupInitiated);
    if (!initiated) {
      yield put(appSetup());
    }
  });
}
