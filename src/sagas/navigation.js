import { takeEvery } from "redux-saga";
import { call, fork } from "redux-saga/effects";

import { Actions } from "react-native-router-flux";

function* forward() {
  yield takeEvery("NAVIGATE", function* ({ payload }) {
    const { route, params } = payload;

    try {
      yield call(Actions[route], params);
    } catch(e) {
      console.log(e);
    }
  });
}

function* backward() {
  yield takeEvery("NAVIGATE_BACK", function* () {
    yield call(Actions.pop);
  });
}

export default function* navigationSaga() {
  yield fork(forward);
  yield fork(backward);
}
