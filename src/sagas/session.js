import { call, fork, put, select, takeLatest } from "redux-saga/effects";

import { LoginManager } from "react-native-fbsdk";

import { isDev } from "../utils";

import { clearSession, logginSucceeded, userLoggedOut } from "../actions";

import { currentAuthToken } from "../selectors";

import { logError } from "../utils";

export function* fetchSession({ sessionStore }) {
  try {
    const user = yield call(sessionStore.retrieve);
    yield put(logginSucceeded(user));
  } catch (e) {
    logError(e);
  }
}

function* fetchSessionSaga({ sessionStore }) {
  yield takeLatest("SESSION_FETCH_SESSION", function* () {
    try {
      yield call(fetchSession, { sessionStore });
    } catch (e) {
      logError(e);
    }
  });
}

function* logoutSaga({ mobileApi, sessionStore }) {
  yield takeLatest("SESSION_LOGOUT", function* () {
    yield call(logout, { mobileApi, sessionStore });
  });
}

export function* logout({ mobileApi, sessionStore }) {
  yield call(sessionStore.destroy);
  yield call(LoginManager.logOut);

  const authToken = yield select(currentAuthToken);
  yield put(clearSession());
  yield put(userLoggedOut());

  if (authToken) {
    if (isDev) console.log("Will call logout api with token:", authToken);
    yield call(mobileApi.logout, authToken);
  }
}

export default function* sessionSaga({ mobileApi, sessionStore }) {
  yield fork(fetchSessionSaga, { sessionStore });

  yield takeLatest("SESSION_LOGGIN_SUCCEEDED", function* () {
    yield fork(logoutSaga, { mobileApi, sessionStore });
  });
}
