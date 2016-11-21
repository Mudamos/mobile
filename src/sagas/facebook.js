import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import { FBLoginManager } from "react-native-facebook-login";

import {
  isLoggingIn,
  logginSucceeded,
  finishedLogIn,
  facebookLogInError,
} from "../actions";

// eslint-disable-next-line no-undef
const isDev = __DEV__;

function* login({ mobileApi, sessionStore }) {
  yield takeLatest("FACEBOOK_USER_LOGGED_IN", function* ({ payload }) {
    const fbToken = payload.data.credentials.token;

    try {
      yield put(isLoggingIn());
      const token =  yield call(mobileApi.fbSignIn, fbToken);
      const user = { token };

      yield call(sessionStore.persist, user);

      yield put(logginSucceeded(user));
    } catch(e) {
      if (isDev) console.log("API Error: ", e.message, e.stack);

      yield call(sessionStore.destroy);
      yield call(FBLoginManager.logout, () => {});
      yield put(finishedLogIn());
      yield put(facebookLogInError(e));
    }
  });
}

export default function* facebookSaga({ mobileApi, sessionStore }) {
  yield fork(login, { mobileApi, sessionStore });
}
