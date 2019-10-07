import { call, put, spawn, select, takeLatest } from "redux-saga/effects";

import { prop } from "ramda";

import {
  isUnauthorized,
  logError,
} from "../utils";

import {
  changingPassword,
  changePasswordError,
  changingForgotPassword,
  changeForgotPasswordError,
  logginSucceeded,
  navigate,
  profileStateMachine,
  retrievingPassword,
  retrievePasswordError,
  unauthorized,
  updatedUserProfile,
} from "../actions";

import {
  currentAuthToken,
} from "../selectors";

import { User } from "../models";

import Toast from "react-native-simple-toast";

import locale from "../locales/pt-BR";
import { blockBuilder } from "./crypto";


function* retrievePassword({ mobileApi, Crypto }) {
  yield takeLatest("PASSWORD_RETRIEVE", function* ({ payload }) {
    try {
      const { cpf, email: userEmail } = payload;
      const email = cpf ? null : userEmail;

      yield put(retrievingPassword(true));

      const message = cpf || email;
      const block = yield call(blockBuilder, { message, mobileApi, Crypto });
      const result = yield call(mobileApi.retrievePassword, { cpf, email, block });

      yield call([Toast, Toast.show], locale.codeSent);
      yield put(navigate("changeForgotPassword", { emailSent: prop("email", result) }));
    } catch(e) {
      logError(e);
      yield put(retrievePasswordError(true, e));
    } finally {
      yield put(retrievingPassword(false));
    }
  });
}

export function* changePasswordSaga({ mobileApi, currentPassword, newPassword }) {
  try {
    yield put(changingPassword(true));

    const authToken = yield select(currentAuthToken);
    yield call(mobileApi.changePassword, authToken, { currentPassword, newPassword });

    yield put(changingPassword(false));
  } catch(e) {
    logError(e);
    if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

    yield put(changingPassword(false));
    yield put(changePasswordError(e));
  }
}

function* changePassword({ mobileApi }) {
  yield takeLatest("PASSWORD_CHANGE", function* ({ payload }) {
    const { currentPassword, newPassword } = payload;

    yield call(changePasswordSaga, { mobileApi, currentPassword, newPassword });
  });
}

function* changeForgotPassword({ mobileApi, sessionStore, Crypto }) {
  yield takeLatest("PASSWORD_CHANGE_FORGOT", function* ({ payload }) {
    try {
      const { code, password } = payload;

      yield put(changingForgotPassword(true));
      const message = [password, code].join(";");
      const block = yield call(blockBuilder, { message, mobileApi, Crypto });
      const response = yield call(mobileApi.changeForgotPassword, { code, password, block });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));

      const accessToken = { token: response.accessToken };
      yield call(sessionStore.persist, accessToken);
      yield put(logginSucceeded(accessToken));

      yield put(changingForgotPassword(false));
      yield put(profileStateMachine());
    } catch(e) {
      logError(e);

      yield put(changingForgotPassword(false));
      yield put(updatedUserProfile({ user: null }));
      yield put(changeForgotPasswordError(e));
    }
  });
}


export default function* passwordSaga({ mobileApi, sessionStore, Crypto }) {
  yield spawn(retrievePassword, { mobileApi, Crypto });
  yield spawn(changePassword, { mobileApi });
  yield spawn(changeForgotPassword, { mobileApi, sessionStore, Crypto });
}
