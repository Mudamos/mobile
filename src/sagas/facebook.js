import { call, fork, put, select, takeLatest } from "redux-saga/effects";

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
  logEvent,
} from "../actions";

import { getCurrentSigningPlip } from "../selectors";

import { User } from "../models";
import { logError } from "../utils";
import { blockBuilder } from "./crypto";


const facebookPermissions = ["public_profile", "email"];

function* login({ mobileApi, sessionStore, Crypto }) {
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
      const currentSigningPlip = yield select(getCurrentSigningPlip);
      const plipId = currentSigningPlip ? currentSigningPlip.id : null;
      const message = fbToken;
      const block = yield call(blockBuilder, { message, mobileApi, Crypto });

      const token =  yield call(mobileApi.fbSignIn, { fbToken, plipId, block });
      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(profileStateMachine({ type: "reset" }));

      yield put(logEvent({ name: "facebook_login" }));
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

export default function* facebookSaga({ mobileApi, sessionStore, Crypto }) {
  yield fork(login, { mobileApi, sessionStore, Crypto });
}
