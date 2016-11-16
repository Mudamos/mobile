import { takeLatest } from "redux-saga";
import { fork, put } from "redux-saga/effects";

import {
  fetchPlips as fetchPlipsAction,
  plipsFetched
} from "../actions";

export function* fetchPlips() {
  yield takeLatest("FETCH_PLIPS", function* () {
    yield put(plipsFetched([{
      id: 1,
      content: "plip body"
    }]));
  });
}
export default function* plipSaga() {
  yield fork(fetchPlips);

  yield put(fetchPlipsAction());
}
