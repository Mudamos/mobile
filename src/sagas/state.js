import { call, spawn, put, takeLatest } from "redux-saga/effects";

import {
  statesFetched,
} from "../actions";


function* fetchStates({ repositories }) {
  yield takeLatest("STATES_FETCH_STATES", function* () {
    const states = yield call(repositories.stateRepository.list);
    yield put(statesFetched({ states }));
  });
}

export default function* stateSaga({ repositories }) {
  yield spawn(fetchStates, { repositories });
}
