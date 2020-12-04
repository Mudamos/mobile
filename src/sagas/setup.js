import { all, call, fork, put, select, takeLatest } from "redux-saga/effects";

import {
  appSetup,
  fetchIsUserFirstTime,
  fetchAboutAppFeedback,
  fetchFeatureToggles,
  fetchRemoteLinks,
  fetchRemoteConfig,
  fetchPlips,
  increaseAppLoading,
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

    yield put(increaseAppLoading());

    yield call(fetchSession, { sessionStore });

    yield all([
      put(increaseAppLoading()),
      put(fetchIsUserFirstTime()),
      put(fetchAboutAppFeedback()),
      put(fetchFeatureToggles()),
      put(fetchRemoteLinks()),
      put(fetchRemoteConfig()),
      put(mainAppInitiatedAction()),
    ]);

    yield put(increaseAppLoading());

    try {
      yield call(fetchProfile, { mobileApi });
      yield put(increaseAppLoading());
    } catch (e) {
      logError(e);
    }

    yield put(fetchPlips({ shouldIncreaseAppLoading: true }));
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
