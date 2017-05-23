import { takeEvery } from "redux-saga";
import { call, fork } from "redux-saga/effects";

import {
  log,
  logError,
} from "../utils";

function* logEvent({ analytics }) {
  yield takeEvery("ANALYTICS_LOG_EVENT", function* ({ payload }) {
    try {
      const { name, extraData } = payload;
      const result = yield call(analytics.logEvent, { name, extraData });
      log(`Event log result: ${result}`);
    } catch (e) {
      logError(e, { tag: "logEvent" });
    }
  });
}

export default function* analyticsSaga({ analytics }) {
  yield fork(logEvent, { analytics });
}
