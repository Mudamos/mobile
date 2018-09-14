import { call, put, select, spawn, takeEvery } from "redux-saga/effects";

import {
  userFirstTimeFetched,
  aboutAppFeedbackFetched,
} from "../actions";

import {
  aboutAppUserFeedback,
} from "../selectors";

import { logError } from "../utils";

const FIRST_OPEN_KEY = "first_time_user";
const ABOUT_APP_FEEDBACK_KEY = "about_app_feedback";

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

function* fetchAboutAppFeedbackSaga({ localStorage }) {
  yield takeEvery("LOCAL_FETCH_ABOUT_APP_FEEDBACK", function* () {
    try {
      const userFeedback = yield call(localStorage.fetch, ABOUT_APP_FEEDBACK_KEY);
      const localUserFeedBack = JSON.parse(userFeedback) || {};
      yield put(aboutAppFeedbackFetched({ userFeedback: localUserFeedBack }));
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

function* userAboutAppFeedbackSaga({ localStorage }) {
  yield takeEvery("LOCAL_USER_ABOUT_APP_FEEDBACK", function* (action) {
    try {
      const { questionAnswered, answer } = action.payload;

      const aboutAppFeedback = yield select(aboutAppUserFeedback);
      const updatedAboutAppFeedBack = {...aboutAppFeedback, [questionAnswered]: answer };

      yield put(aboutAppFeedbackFetched({ userFeedback: updatedAboutAppFeedBack }));
      yield call(localStorage.store, ABOUT_APP_FEEDBACK_KEY, JSON.stringify(updatedAboutAppFeedBack));
    } catch (e) {
      logError(e, { tag: "userAboutAppFeedbackSaga"});
    }
  })
}


export default function* localStorageSaga({ localStorage }) {
  yield spawn(fetchUserFirstTimeSaga, { localStorage });
  yield spawn(userFirstTimeDoneSaga, { localStorage });
  yield spawn(fetchAboutAppFeedbackSaga, { localStorage });
  yield spawn(userAboutAppFeedbackSaga, { localStorage });
}
