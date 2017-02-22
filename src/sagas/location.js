import { takeLatest } from "redux-saga";
import { call, put, spawn } from "redux-saga/effects";

import { log, logError } from "../utils";

import {
  fetchUserLocationError,
  fetchingLocation,
  locationFetched,
  permissionUnauthorized,
} from "../actions";

import { AUTHORIZED } from "../services/permission";


function* location({ locationService, permissionService }) {
  yield takeLatest("LOCATION_FETCH_LOCATION", function* () {
    try {
      yield put(fetchingLocation(true));

      const isAuthorized = (yield call(permissionService.checkStatus, "location")) === AUTHORIZED;

      if (!isAuthorized) {
        yield put(permissionUnauthorized("location"));
        return;
      }

      const result = yield call(locationService.getCurrentPosition, {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      });

      log(result);

      if (result.mocked) throw "Invalid location";

      yield put(locationFetched(result.coords));
    } catch (e) {
      logError(e);

      yield put(fetchUserLocationError(e));
    } finally {
      yield put(fetchingLocation(false));
    }
  });
}

export default function* locationSaga ({ locationService, permissionService }) {
  yield spawn(location, { locationService, permissionService });
}
