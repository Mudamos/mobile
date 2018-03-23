import { take, call, put, spawn, takeLatest } from "redux-saga/effects";

import { all, contains } from "ramda";

import { log, logError } from "../utils";

import locale from "../locales/pt-BR";

import {
  fetchUserLocation,
  fetchUserLocationError,
  permissionUnauthorized,
} from "../actions";

import OpenSettings from "react-native-open-settings";

import {
  AUTHORIZED,
  DENIED,
  OPEN_SETTINGS,
} from "../services/permission";


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

function* avatar({ permissionService }) {
  yield takeLatest("PERMISSION_REQUEST_AVATAR", function* () {
    try {
      const cameraResult = yield call(permissionService.requestPermission, "camera", {
        message: locale.permissions.camera,
        rationale: false,
      });
      const photoResult = yield call(permissionService.requestPermission, "photo", {
        message: locale.permissions.photo,
        rationale: false,
      });

      log(cameraResult, { tag: "camera" });
      log(photoResult, { tag: "camera" });

      const results = [cameraResult, photoResult];
      const accepted = all(v => v === AUTHORIZED);
      const shouldPresentRationale = contains(DENIED);

      if (accepted(results)) {
        return; // no-op
      } else if (shouldPresentRationale(results)) {
        const result = yield call(permissionService.presentRationale, "camera", { message: locale.permissions.camera });
        log(result, { tag: "avatar explanation"});

        if (result === OPEN_SETTINGS) yield call(OpenSettings.openSettings);
        return;
      } else {
        return permissionUnauthorized("avatar");
      }
    } catch (e) {
      logError(e);
    }
  });
}

export default function* permissionSaga ({ permissionService }) {
  yield spawn(location, { permissionService });
  yield spawn(avatar, { permissionService });
}
