import { takeEvery } from "redux-saga";
import { spawn } from "redux-saga/effects";

import Toast from "react-native-simple-toast";


const genericErrorMessage = "Houve um erro ao tentar completar sua ação. Tente novamente.";

const validationMessageFor = validations => (validations || []).map(v => v.message).join("\n");

const errorMessageFor = ({ payload, defaultMessage }) => {
  const { error } = (payload || {});
  let message;

  if (error.type === "validation") {
    message = validationMessageFor(error.validations);
  }

  return message || error.userMessage || defaultMessage || genericErrorMessage;
}

const defaultErrorHandler = ({ payload }) =>
  Toast.show(
    errorMessageFor({
      payload,
    })
  )

function* facebookLoginError() {
  yield takeEvery("FACEBOOK_LOGIN_ERROR", () => Toast.show("Erro ao tentar entrar com o facebook."));
}

function* loginError() {
  yield takeEvery("AUTHENTICATION_LOGIN_ERROR", ({ payload }) =>
    Toast.show(
      errorMessageFor({
        payload,
        defaultMessage: "Houve um erro ao efetuar o login. Tente novamente.",
      })
    )
  );
}

function* saveUserProfileError() {
  yield takeEvery("PROFILE_USER_SAVE_FAILURE", defaultErrorHandler);
}

export default function* errorSaga() {
  yield spawn(facebookLoginError);
  yield spawn(loginError);
  yield spawn(saveUserProfileError);
}
