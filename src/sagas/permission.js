import { takeLatest } from "redux-saga";
import { take, call, put, spawn } from "redux-saga/effects";

import { log, logError } from "../utils";

import {
  fetchUserLocation,
  fetchUserLocationError,
  permissionUnauthorized,
} from "../actions";

import OpenSettings from "react-native-open-settings";

import { AUTHORIZED, OPEN_SETTINGS } from "../services/permission";


function* location({ permissionService }) {
  yield takeLatest("PERMISSION_REQUEST_LOCATION", function* ({ payload }) {
    try {
      const { message } = payload;

      const result = yield call(permissionService.requestPermission, "location", { message });
      log(result, { tag: "location" });

      switch (result) {
        case AUTHORIZED:
          return yield put(fetchUserLocation());
        case OPEN_SETTINGS:
          yield call(OpenSettings.openSettings);
          yield take("APP_ON_FOREGROUND");
          return yield put(fetchUserLocation());
        default:
          return permissionUnauthorized("location");
      }
    } catch (e) {
      logError(e);
      yield put(fetchUserLocationError(e));
    }
  });
}

export default function* permissionSaga ({ permissionService }) {
  yield spawn(location, { permissionService });
}
