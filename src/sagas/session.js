import { takeLatest } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";

import { LoginManager } from "react-native-fbsdk";

import { isDev } from "../utils";

import {
  clearSession,
  logginSucceeded,
} from "../actions";

import {
  currentAuthToken,
} from "../selectors";

function* fetchSession({ sessionStore }) {
  yield takeLatest("SESSION_FETCH_SESSION", function* () {
    try {
      const user = yield call(sessionStore.retrieve);
      yield put(logginSucceeded(user));
    } catch(e) {
      if(isDev) console.log(e.message);
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

  if (authToken) {
    if (isDev) console.log("Will call logout api with token:", authToken);
    yield call(mobileApi.logout, authToken);
  }
}

export default function* sessionSaga({ mobileApi, sessionStore }) {
  yield fork(fetchSession, { sessionStore });

  yield takeLatest("SESSION_LOGGIN_SUCCEEDED", function* () {
    yield fork(logoutSaga, { mobileApi, sessionStore });
  });
}
