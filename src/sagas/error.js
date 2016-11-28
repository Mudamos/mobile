import { takeEvery } from "redux-saga";
import { spawn } from "redux-saga/effects";

import Toast from "react-native-simple-toast";


const errorMessageFor = ({ payload, defaultMessage }) => {
  const { error } = payload;
  const message = error && error.userMessage || defaultMessage || "Houve um erro ao tentar completar sua ação. Tente novamente.";

  return message;
}

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

export default function* errorSaga() {
  yield spawn(facebookLoginError);
  yield spawn(loginError);
}
