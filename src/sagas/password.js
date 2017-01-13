import { takeLatest } from "redux-saga";
import { call, put, spawn } from "redux-saga/effects";

import { logError } from "../utils";

import {
  changingForgotPassword,
  changeForgotPasswordError,
  logginSucceeded,
  navigate,
  profileStateMachine,
  retrievingPassword,
  retrievePasswordError,
  updatedUserProfile,
} from "../actions";

import { User } from "../models";

import Toast from "react-native-simple-toast";

import locale from "../locales/pt-BR";


function* retrievePassword({ mobileApi }) {
  yield takeLatest("PASSWORD_RETRIEVE", function* ({ payload }) {
    try {
      const { email } = payload;

      yield put(retrievingPassword(true));
      yield call(mobileApi.retrievePassword, email);

      yield call([Toast, Toast.show], locale.codeSent);
      yield put(navigate("changeForgotPassword"));
    } catch(e) {
      logError(e);
      yield put(retrievePasswordError(true));
    } finally {
      yield put(retrievingPassword(false));
    }
  });
}

function* changeForgotPassword({ mobileApi, sessionStore }) {
  yield takeLatest("PASSWORD_CHANGE_FORGOT", function* ({ payload }) {
    try {
      const { code, password } = payload;

      yield put(changingForgotPassword(true));
      const response = yield call(mobileApi.changeForgotPassword, { code, password });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user, profileComplete: response.complete }));

      const accessToken = { token: response.accessToken };
      yield call(sessionStore.persist, accessToken);
      yield put(logginSucceeded(accessToken));

      yield put(changingForgotPassword(false));
      yield put(profileStateMachine());
    } catch(e) {
      logError(e);

      yield put(changingForgotPassword(false));
      yield put(updatedUserProfile({ user: null, profileComplete: false }));
      yield put(changeForgotPasswordError(e));
    }
  });
}


export default function* passwordSaga({ mobileApi, sessionStore }) {
  yield spawn(retrievePassword, { mobileApi });
  yield spawn(changeForgotPassword, { mobileApi, sessionStore });
}
