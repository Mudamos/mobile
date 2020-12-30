import { fork, take, call, put, spawn, takeLatest } from "redux-saga/effects";

import { equals } from "ramda";

import { log, logError } from "../utils";

import locale from "../locales/pt-BR";

import {
  fetchUserLocation,
  fetchUserLocationError,
  permissionAuthorized,
  permissionUnauthorized,
} from "../actions";

import { Linking } from "react-native";

import { AUTHORIZED, DENIED, OPEN_SETTINGS } from "../services/permission";

const isPermissionGranted = equals(AUTHORIZED);
const shouldPresentRationale = equals(DENIED);

function* location({ permissionService }) {
  yield takeLatest("PERMISSION_REQUEST_LOCATION", function* ({ payload }) {
    try {
      const { message } = payload;

      const result = yield call(
        permissionService.requestPermission,
        permissionService.permissions.location,
        { message },
      );
      log(result, { tag: "location" });

      switch (result) {
        case AUTHORIZED:
          return yield put(fetchUserLocation());
        case OPEN_SETTINGS:
          yield call(Linking.openSettings);
          yield take("APP_ON_FOREGROUND");
          return yield put(fetchUserLocation());
        default:
          return yield put(permissionUnauthorized("location"));
      }
    } catch (e) {
      logError(e);
      yield put(fetchUserLocationError(e));
    }
  });
}

function* camera({ permissionService }) {
  yield takeLatest("PERMISSION_REQUEST_CAMERA", function* () {
    try {
      const permission = permissionService.permissions.camera;
      const cameraResult = yield call(
        permissionService.requestPermission,
        permission,
        {
          message: locale.permissions.camera,
          rationale: false,
        },
      );

      log(cameraResult, { tag: "camera" });

      if (isPermissionGranted(cameraResult)) {
        return yield put(permissionAuthorized(permission));
      } else if (shouldPresentRationale(cameraResult)) {
        const result = yield call(permissionService.presentRationale, {
          message: locale.permissions.camera,
        });
        log(result, { tag: "Camera explanation" });

        if (result === OPEN_SETTINGS) yield call(Linking.openSettings);
        return;
      }
    } catch (e) {
      logError(e);
    }
  });
}

function* gallery({ permissionService }) {
  yield takeLatest("PERMISSION_REQUEST_GALLERY", function* () {
    try {
      const permission = permissionService.permissions.photo;
      const photoResult = yield call(
        permissionService.requestPermission,
        permission,
        {
          message: locale.permissions.photo,
          rationale: false,
        },
      );

      log(photoResult, { tag: "photo" });

      if (isPermissionGranted(photoResult)) {
        return yield put(permissionAuthorized(permission));
      } else if (shouldPresentRationale(photoResult)) {
        const result = yield call(permissionService.presentRationale, {
          message: locale.permissions.camera,
        });
        log(result, { tag: "Camera explanation" });

        if (result === OPEN_SETTINGS) yield call(Linking.openSettings);
        return;
      }
    } catch (e) {
      logError(e);
    }
  });
}

export default function* permissionSaga({ permissionService }) {
  yield spawn(location, { permissionService });
  yield fork(camera, { permissionService });
  yield fork(gallery, { permissionService });
}
