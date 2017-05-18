import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  logError,
} from "../utils";

import {
  featureTogglesFetched,
} from "../actions";

const FEATURE_TOGGLE_NAMES = [
  "plip_remaining_days_enabled",
];

function* fetchFeatureToggles({ RemoteConfigService }) {
  yield takeLatest("FEATURE_FETCH_FEATURE_TOGGLES", function* () {
    try {
      const [
        plipRemainingDaysEnabled,
      ] = yield FEATURE_TOGGLE_NAMES.map(name => call(RemoteConfigService.asBoolean, name));

      const features = {
        plipRemainingDaysEnabled,
      };

      yield put(featureTogglesFetched(features));
    } catch(e) {
      logError(e, { tag: "fetchFeatureToggles" });
    }
  });
}

export default function* featureSaga({ RemoteConfigService }) {
  yield fork(fetchFeatureToggles, { RemoteConfigService });
}
