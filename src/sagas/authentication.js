import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  isLoggingIn,
  logginSucceeded,
  finishedLogIn,
  logInError,
  updatedUserProfile,
  profileStateMachine,
  clearSession,
  logEvent,
} from "../actions";

import { User } from "../models";
import { isDev } from "../utils";


function* login({ mobileApi, sessionStore }) {
  yield takeLatest("SESSION_LOGIN_USER", function* ({ payload }) {
    const { email, password } = payload;

    try {
      yield put(isLoggingIn());
      const token =  yield call(mobileApi.signIn, email, password);
      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(profileStateMachine({ type: "reset" }));
      yield put(logEvent({ name: "app_login" }));
    } catch(e) {
      if (isDev) console.log("API Error: ", e.message, e.stack);

      yield call(sessionStore.destroy);
      yield put(clearSession());
      yield put(finishedLogIn());
      yield put(logInError(e));
    }
  });
}

export default function* authenticationSaga({ mobileApi, sessionStore }) {
  yield fork(login, { mobileApi, sessionStore });
}
