import { spawn, put, call, select, takeLatest } from "redux-saga/effects";

import {
  addressZipCodeSearching,
  addressZipCodeSearchError,
  addressReverseZipCodeSearchError,
  addressFound,
  clearLocation,
  navigate,
  unauthorized,
} from "../actions";

import { currentAuthToken } from "../selectors";

import {
  isUnauthorized,
  log,
  logError,
} from "../utils";

import { Address } from "../models";

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;

function* searchZipCode({ mobileApi }) {
  yield takeLatest("ADDRESS_ZIP_CODE_SEARCH", function* ({ payload }) {
    try {
      const { zipCode } = payload;

      yield put(addressZipCodeSearching(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.searchZipCode, authToken, zipCode);

      yield put(addressFound(Address.fromJson(response)));
      yield put(addressZipCodeSearching(false));
      yield put(clearLocation());
    } catch(e) {
      logError(e, { tag: "searchZipCode" });

      yield put(addressZipCodeSearching(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(addressZipCodeSearchError(e));
    }
  });
}

function* searchZipCodeWithCoords({ mobileApi }) {
  yield takeLatest("ADDRESS_ZIP_CODE_SEARCH_WITH_COORDS", function* ({ payload }) {
    try {
      const { latitude, longitude } = payload;
      log(`Will search with lat: ${latitude} lng: ${longitude}`);

      yield put(addressZipCodeSearching(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.reverseSearchZipCode, authToken, { latitude, longitude });

      if (response && response.zipcode) {
        yield put(addressFound(Address.fromJson(response)));
        yield put(clearLocation());
      }

      yield put(addressZipCodeSearching(false));
    } catch(e) {
      logError(e, { tag: "searchZipCodeWithCoords" });

      yield put(addressZipCodeSearching(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(addressReverseZipCodeSearchError(e));
    }
  });
}

export default function* addressSaga({ mobileApi }) {
  yield spawn(searchZipCode, { mobileApi });
  yield spawn(searchZipCodeWithCoords, { mobileApi });
}
