import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  isLoggingIn,
  logginSucceeded,
  finishedLogIn,
  logInError,
} from "../actions";

import { isDev } from "../utils";


function* login({ mobileApi, sessionStore }) {
  yield takeLatest("SESSION_LOGIN_USER", function* ({ payload }) {
    const { email, password } = payload;

    try {
      yield put(isLoggingIn());
      const token =  yield call(mobileApi.signIn, email, password);
      const user = { token };

      yield call(sessionStore.persist, user);

      yield put(logginSucceeded(user));
    } catch(e) {
      if (isDev) console.log("API Error: ", e.message, e.stack);

      yield call(sessionStore.destroy);
      yield put(finishedLogIn());
      yield put(logInError(e));
    }
  });
}

export default function* authenticationSaga({ mobileApi, sessionStore }) {
  yield fork(login, { mobileApi, sessionStore });
}
