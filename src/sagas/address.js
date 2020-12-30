import {
  spawn,
  put,
  call,
  race,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";

import {
  addressZipCodeSearching,
  addressZipCodeSearchError,
  addressReverseZipCodeSearchError,
  addressFound,
  clearLocation,
  requestUserLocation,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  fetchLocation as fetchAddress,
  getUserLocation as getUserCoordinates,
} from "../selectors";

import { isUnauthorized, log, logError, propIsPresent } from "../utils";

import { Address } from "../models";
import { UserLocationError } from "../models/error";
import locale from "../locales/pt-BR";

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
    } catch (e) {
      logError(e, { tag: "searchZipCode" });

      yield put(addressZipCodeSearching(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

      yield put(addressZipCodeSearchError(e));
    }
  });
}

function* searchZipCodeWithCoordsSaga({ mobileApi }) {
  yield takeLatest("ADDRESS_ZIP_CODE_SEARCH_WITH_COORDS", function* ({
    payload,
  }) {
    const { latitude, longitude } = payload;
    yield call(searchZipCodeWithCoords, { mobileApi, latitude, longitude });
  });
}

function* searchZipCodeWithCoords({ mobileApi, latitude, longitude }) {
  try {
    log(`Will search with lat: ${latitude} lng: ${longitude}`);

    yield put(addressZipCodeSearching(true));

    const authToken = yield select(currentAuthToken);
    const response = yield call(mobileApi.reverseSearchZipCode, authToken, {
      latitude,
      longitude,
    });

    const found = response && response.zipcode;
    const address = found ? Address.fromJson(response) : null;

    if (found) {
      yield put(addressFound(address));
      yield put(clearLocation());
    }

    yield put(addressZipCodeSearching(false));

    return address;
  } catch (e) {
    logError(e, { tag: "searchZipCodeWithCoords" });

    yield put(addressZipCodeSearching(false));

    if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

    yield put(addressReverseZipCodeSearchError(e));
  }
}

export function* getUserCurrentAddressByGeoLocation({ message, mobileApi }) {
  const address = yield select(fetchAddress);
  log(
    "User previous address",
    { tag: "getUserCurrentAddressByGeoLocation" },
    { address },
  );

  if (address && address.uf && address.city) return address;

  const coordinates = yield select(getUserCoordinates);
  log(
    "User previous coordinates",
    { tag: "getUserCurrentAddressByGeoLocation" },
    { coordinates },
  );

  if (
    propIsPresent("latitude", coordinates) &&
    propIsPresent("longitude", coordinates)
  ) {
    const { latitude, longitude } = coordinates;
    return yield call(searchZipCodeWithCoords, {
      mobileApi,
      latitude,
      longitude,
    });
  }

  yield put(requestUserLocation({ message }));

  const { locationResponse, locationError, unauthorized } = yield race({
    locationResponse: take("LOCATION_FETCHED"),
    locationError: take("LOCATION_FETCH_LOCATION_ERROR"),
    unauthorized: take("PERMISSION_UNAUTHORIZED"),
  });

  log(
    "Location result",
    { tag: "getUserCurrentAddressByGeoLocation" },
    { locationResponse, locationError, unauthorized },
  );

  const hasError = locationError || unauthorized;
  const hasLocation =
    locationResponse &&
    propIsPresent("latitude", locationResponse.payload) &&
    propIsPresent("longitude", locationResponse.payload);

  if (hasError || !hasLocation) {
    throw new UserLocationError({
      userMessage: locale.errors.geoLocationError,
    });
  }

  const { latitude, longitude } = locationResponse.payload;
  return yield call(searchZipCodeWithCoords, {
    mobileApi,
    latitude,
    longitude,
  });
}

export default function* addressSaga({ mobileApi }) {
  yield spawn(searchZipCode, { mobileApi });
  yield spawn(searchZipCodeWithCoordsSaga, { mobileApi });
}
