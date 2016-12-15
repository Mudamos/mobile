import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import { FBLoginManager } from "react-native-facebook-login";

import {
  isLoggingIn,
  logginSucceeded,
  finishedLogIn,
  facebookLogInError,
  updatedUserProfile,
  profileStateMachine,
  clearSession,
} from "../actions";

import { User } from "../models";
import { isDev } from "../utils";


function* login({ mobileApi, sessionStore }) {
  yield takeLatest("FACEBOOK_USER_LOGGED_IN", function* ({ payload }) {
    const fbToken = payload.data.credentials.token;

    try {
      yield put(isLoggingIn());
      const token =  yield call(mobileApi.fbSignIn, fbToken);
      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user, profileComplete: response.complete }));
      yield put(profileStateMachine({ type: "reset" }));
    } catch(e) {
      if (isDev) console.log("API Error: ", e.message, e.stack);

      yield call(sessionStore.destroy);
      yield call(FBLoginManager.logout, () => {});
      yield put(clearSession());
      yield put(finishedLogIn());
      yield put(facebookLogInError(e));
    }
  });
}

export default function* facebookSaga({ mobileApi, sessionStore }) {
  yield fork(login, { mobileApi, sessionStore });
}
