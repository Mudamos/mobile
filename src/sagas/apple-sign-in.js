import { takeLatest } from "redux-saga";
import { call, fork, put, select } from "redux-saga/effects";
import { prop } from "ramda";
import jwtDecode from "jwt-decode";

import appleAuth, {
  AppleAuthError,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from "@invertase/react-native-apple-authentication";

import Toast from "react-native-simple-toast";

import {
  appleSignInError,
  clearSession,
  finishedLogIn,
  isLoggingIn,
  logginSucceeded,
  logEvent,
  profileStateMachine,
  updatedUserProfile,
} from "../actions";
import { User } from "../models";
import { getCurrentSigningPlip } from "../selectors";
import { blockBuilder } from "./crypto";

import locale from "../locales/pt-BR";

import { isDev, isValidEmailRelaxed, log, logError } from "../utils";

function* decodeToken(token) {
  try {
    return yield jwtDecode(token)
  } catch(error) {
    log("Invalid identity token", { tag: "Apple" }, error);
  }
}

function* signIn({ DeviceInfo, mobileApi, localStorage, sessionStore, Crypto }) {
  yield takeLatest("APPLE_SIGN_IN", function* () {
    try {
      const myState = yield call(Crypto.uuid);

      const appleAuthRequestResponse = yield call([appleAuth, appleAuth.performRequest], {
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        state: myState,
      });

      log("Response: ", { tag: "Apple" }, appleAuthRequestResponse);

      const {
        authorizedScopes,
        authorizationCode,
        user: appleUserId,
        email: signEmail,
        fullName: signFullName,
        identityToken,
        nonce,
        state,
      } = (appleAuthRequestResponse || {});

      if (!identityToken || state !== myState) {
        yield put(finishedLogIn());
        yield call([Toast, Toast.show], locale.unableToContactApple);

        return;
      }

      const isEmulator = yield call(DeviceInfo.isEmulator);

      // Credential checking does not work on emulators
      const checkCredentialAuthorization = !isDev || isDev && !isEmulator;

      if (checkCredentialAuthorization) {
        log("Checking credential state");

        const credentialState = yield call([appleAuth, appleAuth.getCredentialStateForUser], appleUserId);

        if (credentialState !== AppleAuthCredentialState.AUTHORIZED) {
          log("Sign in has been denied", { tag: "Apple" }, { credentialState }, AppleAuthCredentialState);

          yield call([Toast, Toast.show], locale.userDeniedAppleAccess);
          yield put(finishedLogIn());

          return;
        }
      }

      const appleUserInfoKey = `APPLE-USER-INFO-${appleUserId}`;

      // We don't have access to the email and/or fullName on the second login
      // so Apple suggests we store it locally.
      //
      // Only the email is really required for us, so the email can be retrieved
      // from the identityToken anyway. See decodeToken.
      const cacheInfo = yield call(localStorage.findOrCreate, appleUserInfoKey, () => ({
        email: signEmail,
        fullName: signFullName,
      }));

      const tokenInfo = yield call(decodeToken, identityToken);

      const fullName = cacheInfo.fullName;
      const email = cacheInfo.email || tokenInfo.email;

      if (!isValidEmailRelaxed(email)) {
        yield call([Toast, Toast.show], locale.noEmailDuringSignIn);
        yield put(finishedLogIn());

        return;
      }

      yield put(isLoggingIn());

      const currentSigningPlip = yield select(getCurrentSigningPlip);
      const plipId = prop("id", currentSigningPlip);
      const block = yield call(blockBuilder, { message: identityToken, mobileApi, Crypto });

      const token =  yield call(mobileApi.appleSignIn, {
        appleUserId,
        authorizedScopes,
        authorizationCode,
        email,
        fullName,
        identityToken,
        nonce,
        plipId,
        block,
      });

      const appAuth = { token };

      yield call(sessionStore.persist, appAuth);

      yield put(logginSucceeded(appAuth));

      const response = yield call(mobileApi.profile, appAuth.token);
      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(profileStateMachine());

      yield put(logEvent({ name: "apple_sign_in" }));
    } catch(error) {
      if (prop("code", error) === AppleAuthError.CANCELED) {
        log("User cancelled operation");
        return;
      }

      logError(error);

      yield call(sessionStore.destroy);
      yield put(clearSession());
      yield put(finishedLogIn());
      yield put(appleSignInError(error));
    }
  });
}

export default function* appleSignInSaga({ Crypto, DeviceInfo, localStorage, mobileApi, sessionStore }) {
  yield fork(signIn, { Crypto, DeviceInfo, localStorage, mobileApi, sessionStore });
}
