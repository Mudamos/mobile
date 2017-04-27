import { takeEvery } from "redux-saga";
import { call, spawn, put, select } from "redux-saga/effects";

import {
  homeSceneKey,
  NATIONWIDE_SCOPE,
} from "../utils";

import {
  findNationwidePlips,
  getPlipsFilters,
} from "../selectors";

import {
  fetchNationwidePlips,
  fetchCities,
  fetchStates,
} from "../actions";

function* preAction() {
  yield takeEvery("NAVIGATE", function* ({ payload }) {
    const { route } = payload;

    switch (route) {
      case homeSceneKey:
        yield call(whenHome);
        break;
      case "cityFilter":
        yield put(fetchCities());
        break;
      case "stateFilter":
        yield put(fetchStates());
        break;
    }
  });
}

function* whenHome() {
  const filters = yield select(getPlipsFilters);

  // Only nationwide scope matters.
  // The other scopes will be triggered when changing tabs
  if (filters.scope !== NATIONWIDE_SCOPE) return;

  const nationwidePlips = yield select(findNationwidePlips);

  if (!nationwidePlips || !nationwidePlips.length) {
    yield put(fetchNationwidePlips());
  }
}

export default function* preActionSaga() {
  yield spawn(preAction);
}
