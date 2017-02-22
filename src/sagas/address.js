import { takeLatest } from "redux-saga";
import { spawn, put, call, select } from "redux-saga/effects";

import {
  addressZipCodeSearching,
  addressZipCodeSearchError,
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
      yield put(navigate("profileAddressConfirm"));
    } catch(e) {
      logError(e, { tag: "searchZipCode" });

      yield put(addressZipCodeSearching(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(addressZipCodeSearchError(e));
    }
  });
}

// eslint-disable-next-line no-unused-vars
function* searchZipCodeWithCoords({ mobileApi }) {
  yield takeLatest("ADDRESS_ZIP_CODE_SEARCH_WITH_COORDS", function ({ payload }) {
    const { latitude, longitude } = payload;
    log(`Will search with lat: ${latitude} lng: ${longitude}`);
  });
}

export default function* addressSaga({ mobileApi }) {
  yield spawn(searchZipCode, { mobileApi });
  yield spawn(searchZipCodeWithCoords, { mobileApi });
}
