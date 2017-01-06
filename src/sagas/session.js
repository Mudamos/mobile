import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import { LoginManager } from "react-native-fbsdk";

import { isDev } from "../utils";

import {
  clearSession,
  logginSucceeded,
} from "../actions";

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

function* logoutSaga({ sessionStore }) {
  yield takeLatest("SESSION_LOGOUT", function* () {
    yield call(logout, { sessionStore });
  });
}

export function* logout({ sessionStore }) {
  yield call(sessionStore.destroy);
  yield call(LoginManager.logOut);
  // TODO: call logout api but failures should not propagate
  yield put(clearSession());
}

export default function* sessionSaga({ sessionStore }) {
  yield fork(fetchSession, { sessionStore });

  yield takeLatest("SESSION_LOGGIN_SUCCEEDED", function* () {
    yield fork(logoutSaga, { sessionStore });
  });
}
