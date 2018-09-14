import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";

import {
  appSetup,
  fetchIsUserFirstTime,
  fetchAboutAppFeedback,
  fetchFeatureToggles,
  fetchRemoteLinks,
  fetchRemoteConfig,
  fetchPlips,
  mainAppInitiated as mainAppInitiatedAction,
  signMessage,
} from "../actions";

import { fetchProfile } from "./profile";
import { fetchSession } from "./session";
import { mainAppInitiated } from "../selectors";

import { logError } from "../utils";

function* setup({ mobileApi, mudamosSigner, sessionStore }) {
  yield takeLatest("SETUP", function* () {
    const isMainApp = yield call(mudamosSigner.isMainApp);
    if (!isMainApp) return;

    yield call(fetchSession, { sessionStore });

    yield all([
      put(fetchIsUserFirstTime()),
      put(fetchAboutAppFeedback()),
      put(fetchFeatureToggles()),
      put(fetchRemoteLinks()),
      put(fetchRemoteConfig()),
      put(mainAppInitiatedAction()),
    ]);

    try {
      yield call(fetchProfile, { mobileApi });
    } catch(e) {
      logError(e);
    }

    yield put(fetchPlips());
  });

  yield takeLatest("ACTION_SIGN_APP_SETUP", function* () {
    const isSignerApp = yield call(mudamosSigner.isSignerApp);
    if (!isSignerApp) return;

    yield call(fetchSession, { sessionStore });
    yield put(signMessage());
  });
}
export default function* setupSaga({ mobileApi, mudamosSigner, sessionStore }) {
  yield fork(setup, { mobileApi, mudamosSigner, sessionStore });

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
