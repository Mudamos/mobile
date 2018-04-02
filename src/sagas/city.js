import { call, spawn, put, takeLatest } from "redux-saga/effects";

import {
  citiesFetched,
} from "../actions";


function* fetchCities({ repositories }) {
  yield takeLatest("CITIES_FETCH_CITIES", function* () {
    const cities = yield call(repositories.cityRepository.list);
    yield put(citiesFetched({ cities }));
  });
}

export default function* citySaga({ repositories }) {
  yield spawn(fetchCities, { repositories });
}
