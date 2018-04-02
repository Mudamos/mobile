import { call, put, spawn, takeEvery } from "redux-saga/effects";

import { Linking } from "react-native";

import { logError } from "../utils";

import { openURLError } from "../actions";


function* openURL() {
  yield takeEvery("LINKING_OPEN_URL", function* ({ payload }) {
    try {
      const { url } = payload;

      yield call([Linking, Linking.openURL], url);
    } catch (e) {
      logError(e, { tag: "openURL" });

      yield put(openURLError(e));
    }
  });
}

export default function* linkingSaga() {
  yield spawn(openURL);
}
