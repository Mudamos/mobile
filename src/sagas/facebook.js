import { pick } from "ramda";
import { call, fork, put, select, takeLatest } from "redux-saga/effects";

import { Platform } from "react-native";
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
  Profile,
} from "react-native-fbsdk-next";

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
const LOGIN_WITHOUT_EVENT_TRACKING = "limited";

function* getFBAccessToken() {
  return yield call(
    Platform.select({
      ios: AuthenticationToken.getAuthenticationTokenIOS,
      android: AccessToken.getCurrentAccessToken,
    }),
  );
}

function* getFBProfileOICDData() {
  if (Platform.OS === "android") {
    return { valid: true };
  }

  const fbProfile = yield call(Profile.getCurrentProfile);

  const allAttrs = pick(["email", "name", "userID", "imageURL"]);

  const profile = allAttrs(fbProfile || {});

  if (!profile.email || !profile.name || !profile.userID) {
    return { valid: false };
  }

  return { valid: true, profile };
}

function* login({ mobileApi, sessionStore, Crypto }) {
  yield takeLatest("FACEBOOK_USER_LOG_IN", function* () {
    try {
      const fbResult = yield call(
        LoginManager.logInWithPermissions,
        facebookPermissions,
        LOGIN_WITHOUT_EVENT_TRACKING,
      );

      if (fbResult.isCancelled) {
        yield put(finishedLogIn());
        return;
      }

      const { valid } = yield call(getFBProfileOICDData);

      if (!valid) {
        return;
      }

      yield put(isLoggingIn());

      const tokenData = yield call(getFBAccessToken);
      yield put(facebookUserLoggedIn(tokenData));

      const fbToken = (tokenData.accessToken
        ? tokenData.accessToken
        : tokenData.authenticationToken
      ).toString();

      const currentSigningPlip = yield select(getCurrentSigningPlip);
      const plipId = currentSigningPlip ? currentSigningPlip.id : null;
      const message = fbToken;
      const block = yield call(blockBuilder, { message, mobileApi, Crypto });

      const token = yield call(
        Platform.select({
          ios: mobileApi.fbLimitedSignIn,
          android: mobileApi.fbSignIn,
        }),
        {
          fbToken,
          plipId,
          block,
        },
      );
      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(profileStateMachine());

      yield put(logEvent({ name: "facebook_login" }));
    } catch (e) {
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
