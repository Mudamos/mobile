import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  fetchPlips as fetchPlipsAction,
  plipsFetched,
  plipsFetchError
} from "../actions";

export function* fetchPlips({ mudamosWebApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      const plips = yield call(mudamosWebApi.listPlips);
      yield put(plipsFetched(plips));
    } catch(e) {
      yield put(plipsFetchError(e));
    }
  });
}

export default function* plipSaga({ mudamosWebApi }) {
  yield fork(fetchPlips, { mudamosWebApi });

  yield put(fetchPlipsAction());
}
