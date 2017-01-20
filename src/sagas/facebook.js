import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import { AccessToken, LoginManager } from "react-native-fbsdk";

import {
  isLoggingIn,
  logginSucceeded,
  facebookUserLoggedIn,
  finishedLogIn,
  facebookLogInError,
  updatedUserProfile,
  profileStateMachine,
  clearSession,
} from "../actions";

import { User } from "../models";
import { logError } from "../utils";


const facebookPermissions = ["public_profile", "email"];

function* login({ mobileApi, sessionStore }) {
  yield takeLatest("FACEBOOK_USER_LOG_IN", function* () {
    try {
      const fbResult = yield call(LoginManager.logInWithReadPermissions, facebookPermissions);

      if (fbResult.isCancelled) {
        yield put(finishedLogIn());
        return
      }

      yield put(isLoggingIn());

      const tokenData = yield call(AccessToken.getCurrentAccessToken);
      yield put(facebookUserLoggedIn(tokenData));

      const fbToken = tokenData.accessToken.toString();
      const token =  yield call(mobileApi.fbSignIn, fbToken);
      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(profileStateMachine({ type: "reset" }));
    } catch(e) {
      logError(e);

      yield call(sessionStore.destroy);
      yield call(LoginManager.logOut);
      yield put(clearSession());
      yield put(finishedLogIn());
      yield put(facebookLogInError(e));
    }
  });
}

export default function* facebookSaga({ mobileApi, sessionStore }) {
  yield fork(login, { mobileApi, sessionStore });
}
