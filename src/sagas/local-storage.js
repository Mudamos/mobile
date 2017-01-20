import { takeEvery } from "redux-saga";
import { call, put, spawn } from "redux-saga/effects";

import {
  userFirstTimeFetched,
} from "../actions";

import { logError } from "../utils";

const FIRST_OPEN_KEY = "first_time_user";

function* fetchUserFirstTimeSaga({ localStorage }) {
  yield takeEvery("LOCAL_FETCH_IS_USER_FIRST_TIME", function* () {
    try {
      const isUserFirstTime = yield call(localStorage.fetch, FIRST_OPEN_KEY);
      yield put(userFirstTimeFetched({ isUserFirstTime: isUserFirstTime !== false }));
    } catch (e) {
      logError(e, { tag: "fetchUserFirstTimeSaga"});
    }
  })
}

function* userFirstTimeDoneSaga({ localStorage }) {
  yield takeEvery("LOCAL_USER_FIRST_TIME_DONE", function* () {
    try {
      yield call(localStorage.store, FIRST_OPEN_KEY, false);
    } catch (e) {
      logError(e, { tag: "userFirstTimeDoneSaga"});
    }
  })
}


export default function* localStorageSaga({ localStorage }) {
  yield spawn(fetchUserFirstTimeSaga, { localStorage });
  yield spawn(userFirstTimeDoneSaga, { localStorage });
}
