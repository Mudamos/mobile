import { call, fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga";
import { NativeModules } from "react-native";
import { omit } from "ramda";

import signMessage from "./sign-message";
import sessionSaga from "../session";
import { fetchSession } from "../session";

function* setup() {
  yield takeLatest("SETUP", function* () {
    const data = yield call(NativeModules.SignerAction.data);

    if (data && data.activityName === "SignerActivity") {
      console.log("I HAZ SIGNER");
      yield put({ type: "SIGNER_SIGN_MESSAGE" });
    }
  });
}

export default function* rootSaga({
  mobileApi,
  sessionStore,
  walletStore,
}) {
  yield fork(signMessage, { mobileApi, walletStore });
  yield fork(sessionSaga, { mobileApi, sessionStore });
  yield fork(setup);

  yield call(fetchSession, { sessionStore });
  // TODO: this wont wokr on android because the saga could be already running
  // I should fire this on component did mount
  //yield put({ type: "SIGNER_SIGN_MESSAGE" });

  yield takeLatest("SIGNER_CLOSE_APP", function* () {
    NativeModules.SignerAction.done({ dance: "now weeee" });
   // const hasError = yield select(s => !!s.signApp.error.hasError);
   // const errorMessage = yield select(s => s.signApp.error.message);
   // const sign = yield select(s => s.signApp.result);
   // const result = omit(["signedMessage"], { ...sign, message: sign.signedMessage || errorMessage });

   // NativeModules.SignerAction.done({ error: hasError, ...result });
  });
}
