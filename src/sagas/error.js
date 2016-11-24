import { takeEvery } from "redux-saga";
import { fork } from "redux-saga/effects";

import Toast from "react-native-simple-toast";


function* facebookLoginError() {
  yield takeEvery("FACEBOOK_LOGIN_ERROR", () => Toast.show("Erro ao tentar entrar com o facebook."));
}

export default function* errorSaga() {
  yield fork(facebookLoginError);
}
