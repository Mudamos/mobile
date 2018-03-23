import { takeLatest } from "redux-saga";
import { all, call, fork, put, select } from "redux-saga/effects";

import {
  appSetup,
  fetchIsUserFirstTime,
  fetchFeatureToggles,
  fetchRemoteLinks,
  fetchRemoteConfig,
  fetchProfile,
  fetchPlips,
  mainAppInitiated as mainAppInitiatedAction,
  signMessage,
} from "../actions";

import { fetchSession } from "./session";
import { mainAppInitiated } from "../selectors";

function* setup({ mudamosSigner, sessionStore }) {
  yield takeLatest("SETUP", function* () {
    const isMainApp = yield call(mudamosSigner.isMainApp);
    if (!isMainApp) return;

    yield call(fetchSession, { sessionStore });

    yield all([
      put(fetchIsUserFirstTime()),
      put(fetchFeatureToggles()),
      put(fetchRemoteLinks()),
      put(fetchRemoteConfig()),
      put(fetchProfile()),
      put(fetchPlips()),
      put(mainAppInitiatedAction()),
    ]);
  });

  yield takeLatest("ACTION_SIGN_APP_SETUP", function* () {
    const isSignerApp = yield call(mudamosSigner.isSignerApp);
    if (!isSignerApp) return;

    yield call(fetchSession, { sessionStore });
    yield put(signMessage());
  });
}
export default function* setupSaga({ mudamosSigner, sessionStore }) {
  yield fork(setup, { mudamosSigner, sessionStore });

  // If the app was started because of an action
  // the setup process was halted, so we need to initiated the main app again
  yield takeLatest("APP_ON_FOREGROUND", function* () {
    const isMainApp = yield call(mudamosSigner.isMainApp);
    if (!isMainApp) return;

    const initiated = yield select(mainAppInitiated);
    if (!initiated) {
      yield put(appSetup());
    }
  });
}
