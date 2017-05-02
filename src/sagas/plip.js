import { takeEvery, takeLatest } from "redux-saga";
import { cancelled, call, spawn, put, select, fork } from "redux-saga/effects";

import {
  isNil,
  pluck,
  zip,
} from "ramda";

import {
  pickObjNonNilValues,
  homeSceneKey,
  isDev,
  isUnauthorized,
  logError,
  moment,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
} from "../utils";

import {
  appReady,
  citywidePlipsFetched,
  plipsFetchNationwidePlipsNextPageError,
  plipsFetchStatewidePlipsNextPageError,
  plipsFetchCitywidePlipsNextPageError,
  fetchPlipRelatedInfoError,
  fetchNationwidePlips,
  fetchStatewidePlips,
  fetchCitywidePlips,
  fetchNationwidePlipsNextPage,
  fetchStatewidePlipsNextPage,
  fetchCitywidePlipsNextPage,
  fetchingNextNationwidePlipsPage,
  fetchingNationwidePlips,
  fetchingPlipRelatedInfo,
  fetchingPlipSigners,
  fetchPlipSignersError,
  fetchingPlipSignInfo,
  fetchingShortPlipSigners,
  fetchingUserSignInfo,
  invalidatePhone,
  isRefreshingNationwidePlips,
  isSigningPlip,
  navigate,
  plipsAppendNationwidePlips,
  plipsAppendStatewidePlips,
  plipsAppendCitywidePlips,
  nationwidePlipsFetched,
  plipsNationwideFetchError,
  plipsStatewideFetchError,
  plipsCitywideFetchError,
  plipsSingInfoFetched,
  plipJustSigned,
  nationwidePlipsRefreshError,
  statewidePlipsRefreshError,
  citywidePlipsRefreshError,
  plipSigners,
  plipSignError,
  plipSignInfoFetched,
  plipUserSignInfo,
  profileStateMachine,
  refreshNationwidePlips,
  refreshStatewidePlips,
  refreshCitywidePlips,
  replacePlipsFilters,
  signPlip as signPlipAction,
  signingPlip,
  shortPlipSigners,
  statewidePlipsFetched,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  getCurrentSigningPlip,
  getPlipsFilters,
  getNationwidePlipsLoadState,
  getStatewidePlipsLoadState,
  getCitywidePlipsLoadState,
  isUserLoggedIn,
} from "../selectors";

import { fetchProfile } from "./profile";
import { profileScreenForCurrentUser } from "./navigation";
import { validateLocalWallet } from "./wallet";

import LibCrypto from "mudamos-libcrypto";

const isNotNil = x => !isNil(x);

const buildSignMessage = ({ user, plip }) => [
  user.name,
  user.zipCode,
  user.voteCard,
  moment().toISOString(),
  plip.cycle.name,
  plip.id,
].join(";");


function* fetchFilteredPlips() {
  yield takeEvery("FETCH_FILTERED_PLIPS", function* () {
    const filters = yield select(getPlipsFilters);

    switch (filters.scope) {
      case NATIONWIDE_SCOPE:
        yield put(fetchNationwidePlips());
        break;
      case STATEWIDE_SCOPE:
        yield put(fetchStatewidePlips());
        break;
      case CITYWIDE_SCOPE:
        yield put(fetchCitywidePlips());
        break;
    }
  });
}

function* fetchFilteredPlipsNextPage() {
  yield takeEvery("FETCH_FILTERED_PLIPS_NEXT_PAGE", function* () {
    const filters = yield select(getPlipsFilters);

    const canFetch = ({ nextPage, isAlreadyFetching }) => nextPage && !isAlreadyFetching;

    function* whenNationwide() {
      const state = yield select(getNationwidePlipsLoadState);

      if (canFetch(state)) {
        yield put(fetchNationwidePlipsNextPage({ page: state.nextPage }));
      }
    }

    function* whenStatewide() {
      const state = yield select(getStatewidePlipsLoadState);

      if (canFetch(state)) {
        yield put(fetchStatewidePlipsNextPage({ page: state.nextPage }));
      }
    }

    function* whenCitywide() {
      const state = yield select(getCitywidePlipsLoadState);

      if (canFetch(state)) {
        yield put(fetchCitywidePlipsNextPage({ page: state.nextPage }));
      }
    }

    switch (filters.scope) {
      case NATIONWIDE_SCOPE:
        yield call(whenNationwide);
        break;
      case STATEWIDE_SCOPE:
        yield call(whenStatewide);
        break;
      case CITYWIDE_SCOPE:
        yield call(whenCitywide);
        break;
    }
  });
}

function* refreshFilteredPlips() {
  yield takeEvery("PLIPS_REFRESH_FILTERED_PLIPS", function* () {
    const filters = yield select(getPlipsFilters);

    switch (filters.scope) {
      case NATIONWIDE_SCOPE:
        yield put(refreshNationwidePlips());
        break;
      case STATEWIDE_SCOPE:
        yield put(refreshStatewidePlips());
        break;
      case CITYWIDE_SCOPE:
        yield put(refreshCitywidePlips());
        break;
    }
  });
}

export function* fetchNationWidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("FETCH_NATIONWIDE_PLIPS", function* () {
    try {
      yield put(fetchingNationwidePlips(true));
      const response = yield call(fetchPlips, { mudamosWebApi });

      yield put(nationwidePlipsFetched(response));
      yield put(fetchingNationwidePlips(false));
    } catch (e) {
      logError(e);

      yield put(fetchingNationwidePlips(false));
      yield put(plipsNationwideFetchError(e));
    } finally {
      yield put(appReady(true));
    }
  });
}

function* fetchNationwidePlipsNextPageSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_NATIONWIDE_PLIPS_NEXT_PAGE", function* ({ payload }) {
    try {
      const { page } = payload;

      yield put(fetchingNextNationwidePlipsPage(true));
      const response = yield call(fetchPlips, { page, mudamosWebApi });

      yield put(plipsAppendNationwidePlips(response));
    } catch (e) {
      logError(e);

      yield put(plipsFetchNationwidePlipsNextPageError(e));
    } finally {
      yield put(fetchingNextNationwidePlipsPage(false));
    }
  });
}

function* refreshNationwidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_REFRESH_NATIONWIDE_PLIPS", function* () {
    try {
      yield put(isRefreshingNationwidePlips(true));
      const response = yield call(fetchPlips, { page: 1, mudamosWebApi });

      yield put(nationwidePlipsFetched(response));
    } catch (e) {
      logError(e);

      yield put(nationwidePlipsRefreshError(e));
    } finally {
      yield put(isRefreshingNationwidePlips(false));
    }
  });
}

function* fetchStatewidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_STATEWIDE_PLIPS", function* () {
    try {
      const filters = yield select(getPlipsFilters);
      if (!filters.state || !filters.state.uf) {
        return yield put(statewidePlipsFetched({}));
      }

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        uf: filters.state.uf,
      });

      yield put(statewidePlipsFetched(response));
    } catch (e) {
      logError(e);

      if (yield cancelled()) return;

      yield put(plipsStatewideFetchError(e));
    }
  });
}

function* fetchStatewidePlipsNextPageSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_STATEWIDE_PLIPS_NEXT_PAGE", function* ({ payload }) {
    try {
      const { page } = payload;
      const filters = yield select(getPlipsFilters);

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        page,
        uf: filters.state.uf,
      });

      yield put(plipsAppendStatewidePlips(response));
    } catch (e) {
      logError(e);

      yield put(plipsFetchStatewidePlipsNextPageError(e));
    }
  });
}

function* refreshStatewidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_REFRESH_STATEWIDE_PLIPS", function* () {
    try {
      const filters = yield select(getPlipsFilters);
      if (!filters.state || !filters.state.uf) {
        return yield put(statewidePlipsFetched({}));
      }

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        page: 1,
        uf: filters.state.uf,
      });

      yield put(statewidePlipsFetched(response));
    } catch (e) {
      logError(e);

      yield put(statewidePlipsRefreshError(e));
    }
  });
}

function* fetchCitywidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_CITYWIDE_PLIPS", function* () {
    try {
      const filters = yield select(getPlipsFilters);
      if (!filters.city || !filters.city.id) {
        return yield put(citywidePlipsFetched({}));
      }

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        cityId: filters.city.id,
      });

      yield put(citywidePlipsFetched(response));
    } catch (e) {
      logError(e);

      if (yield cancelled()) return;

      yield put(plipsCitywideFetchError(e));
    }
  });
}

function* fetchCitywidePlipsNextPageSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_CITYWIDE_PLIPS_NEXT_PAGE", function* ({ payload }) {
    try {
      const { page } = payload;
      const filters = yield select(getPlipsFilters);

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        page,
        cityId: filters.city.id,
      });

      yield put(plipsAppendCitywidePlips(response));
    } catch (e) {
      logError(e);

      yield put(plipsFetchCitywidePlipsNextPageError(e));
    }
  });
}

function* refreshCitywidePlipsSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_REFRESH_CITYWIDE_PLIPS", function* () {
    try {
      const filters = yield select(getPlipsFilters);
      if (!filters.city || !filters.city.id) {
        return yield put(citywidePlipsFetched({}));
      }

      const response = yield call(fetchPlips, {
        mudamosWebApi,
        page: 1,
        cityId: filters.city.id,
      });

      yield put(citywidePlipsFetched(response));
    } catch (e) {
      logError(e);

      yield put(citywidePlipsRefreshError(e));
    }
  });
}

function* changePlipsFilterState() {
  yield takeLatest("PLIPS_CHANGE_FILTER_STATE", function* () {
    // Clear the current list
    yield put(statewidePlipsFetched({}));
    yield put(fetchStatewidePlips());
  });
}

function* changePlipsFilterCity() {
  yield takeLatest("PLIPS_CHANGE_FILTER_CITY", function* () {
    // Clear the current list
    yield put(citywidePlipsFetched({}));
    yield put(fetchCitywidePlips());
  });
}

function* changePlipsFilter({ localStorage }) {
  const actions = ["PLIPS_CHANGE_FILTER_STATE", "PLIPS_CHANGE_FILTER_CITY"];
  yield takeEvery(actions, function* () {
    try {
      const { state, city } = yield select(getPlipsFilters);
      const filters = pickObjNonNilValues({ state, city });

      yield call(localStorage.store, "plipsFilters", filters);
    } catch(e) {
      logError(e);
      if (isDev) throw e;
    }
  });
}

function* fetchStoredPlipsFilters({ localStorage }) {
  yield takeLatest("PLIPS_FETCH_STORED_FILTERS", function* () {
    try {
      const filters = yield call(localStorage.fetch, "plipsFilters");

      if (filters) {
        yield put(replacePlipsFilters(filters));
      }
    } catch(e) {
      logError(e);
      if (isDev) throw e;
    }
  });
}

function* fetchPlips({ mudamosWebApi, page = 1, uf, cityId }) {
  return yield call(mudamosWebApi.listPlips, { page, uf, cityId });
}

function* fetchPlipRelatedInfo({ mobileApi }) {
  yield takeLatest("PLIP_FETCH_PLIP_RELATED_INFO", function* ({ payload }) {
    try {
      yield put(fetchingPlipRelatedInfo(true));
      const { plipId } = payload;
      const loggedIn = yield select(isUserLoggedIn);

      yield [
        loggedIn ? call(fetchUserSignInfo, { mobileApi, plipId }) : Promise.resolve(),
        call(fetchPlipSignInfo, { mobileApi, plipId }),
        call(fetchShortSigners, { mobileApi, plipId }),
      ];

      yield put(fetchingPlipRelatedInfo(false));

      const currentSigningPlip = yield select(getCurrentSigningPlip);
      if (currentSigningPlip) {
        // Instantly try to sign the plip after loading the page
        yield put(signPlipAction({ plip: currentSigningPlip }));
      }
    } catch (e) {
      logError(e);

      yield put(fetchingPlipRelatedInfo(false));
      yield put(fetchPlipRelatedInfoError(e));

      if (isUnauthorized(e)) return yield put(unauthorized());
    }
  });
}

function* fetchShortSigners({ mobileApi, plipId }) {
  try {
    yield put(fetchingShortPlipSigners(true));
    const loggedIn = yield select(isUserLoggedIn);
    let signers;

    if (loggedIn) {
      const authToken = yield select(currentAuthToken);
      signers = yield call(mobileApi.fetchShortPlipSigners, authToken, { plipId });
    } else {
      signers = yield call(mobileApi.fetchOfflineShortPlipSigners, { plipId });
    }

    const { users, total } = signers;
    yield put(shortPlipSigners({ users, total }));
  } finally {
    yield put(fetchingShortPlipSigners(false));
  }
}

function* fetchUserSignInfo({ mobileApi, plipId }) {
  try {
    const authToken = yield select(currentAuthToken);

    yield put(fetchingUserSignInfo(true));
    const userSignInfo = yield call(mobileApi.userSignInfo, authToken, plipId);
    yield put(plipUserSignInfo({ plipId, info: userSignInfo.signMessage }));
  } finally {
    yield put(fetchingUserSignInfo(false));
  }
}

function* fetchPlipSignInfo({ mobileApi, plipId }) {
  try {
    yield put(fetchingPlipSignInfo(true));
    const plipSignInfo = yield call(mobileApi.plipSignInfo, plipId);
    yield put(plipSignInfoFetched({ plipId, info: plipSignInfo.info }));
  } finally {
    yield put(fetchingPlipSignInfo(false));
  }
}

function* updatePlipSignInfoSaga({ mobileApi }) {
  yield takeEvery("PLIP_JUST_SIGNED", function* ({ payload }) {
    try {
      const { plipId } = payload;
      yield [
        call(fetchPlipSignInfo, { mobileApi, plipId }),
        call(fetchShortSigners, { mobileApi, plipId }),
      ];
    } catch(e) {
      logError(e);
    }
  });
}

function* fetchPlipSignersSaga({ mobileApi }) {
  yield takeLatest("PLIP_FETCH_SIGNERS", function* ({ payload }) {
    try {
      const { plipId } = payload;

      yield put(fetchingPlipSigners(true));
      const loggedIn = yield select(isUserLoggedIn);
      let signers;

      if (loggedIn) {
        const authToken = yield select(currentAuthToken);
        signers = yield call(mobileApi.fetchPlipSigners, authToken, { plipId });
      } else {
        signers = yield call(mobileApi.fetchOfflinePlipSigners, { plipId });
      }

      yield put(plipSigners({ signers: signers.users }));
      yield put(fetchingPlipSigners(false));
    } catch (e) {
      logError(e);

      yield put(fetchingPlipSigners(false));
      yield put(fetchPlipSignersError(e));

      if (isUnauthorized(e)) return yield put(unauthorized());
    }
  });
}

function* signPlip({ mobileApi, walletStore, apiError }) {
  yield takeLatest("PLIP_SIGN", function* ({ payload }) {
    try {
      const { plip } = payload;
      yield put(signingPlip(plip));

      yield put(isSigningPlip(true));

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) return yield put(navigate("signUp"));

      const validWallet = yield call(validateLocalWallet, { walletStore });
      if (!validWallet) {
        if (isDev) console.log("Local wallet is invalid");
        return yield call(invalidateWalletAndNavigate, { alertRevalidate: true });
      }

      // Check profile completion
      const { key: screenKey } = yield call(profileScreenForCurrentUser);

      if (screenKey !== homeSceneKey) return yield put(navigate(screenKey, { type: "reset" }));

      const authToken = yield select(currentAuthToken);

      const seed = yield call(walletStore.retrieve, user.voteCard);
      if (isDev) console.log("Acquired seed", seed);
      if (!seed) return yield call(invalidateWalletAndNavigate, { alertRevalidate: true });

      const difficulty = yield call(mobileApi.difficulty);

      const message = buildSignMessage({ user, plip });
      if (isDev) console.log("Sign message built:", message);
      const block = yield call([LibCrypto, LibCrypto.signMessage], seed, message, difficulty);

      if (isDev) {
        console.log("Block:", block);
        console.log("Will call sign plip api");
      }

      try {
        const apiResult = yield call(mobileApi.signPlip, authToken, {
          petitionId: plip.id,
          block,
        });

        if (isDev) console.log("Sign api result:", apiResult);

        yield put(plipUserSignInfo({ plipId: plip.id, info: apiResult.signMessage }));
        yield put(plipJustSigned({ plipId: plip.id })); //Marks the flow end
        yield put(signingPlip(null));
      } catch (e) {
        logError(e);
        if (isDev) console.log("is wallet invalid?", apiError.isInvalidWallet(e), e.errorCode, e);

        if (apiError.isInvalidWallet(e)) return yield call(invalidateWalletAndNavigate, { alertRevalidate: true });

        if (apiError.isErrorAlreadySigned(e)) {
          if (isDev) console.log("User already signed the plip. No op.");
          return;
        }

        throw e;
      }
    } catch(e) {
      logError(e);
      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(plipSignError(e));
      yield put(signingPlip(null));
    } finally {
      yield put(isSigningPlip(false));
    }
  });
}

function* invalidateWalletAndNavigate(params = {}) {
  yield put(invalidatePhone());
  yield put(profileStateMachine(params));
}

function* fetchPlipsSignInfoSaga({ mobileApi }) {
  const actions = [
    "PLIPS_NATIONWIDE_FETCHED",
    "PLIPS_STATEWIDE_FETCHED",
    "PLIPS_CITYWIDE_FETCHED",
    "PLIPS_APPEND_NATIONWIDE_PLIPS",
    "PLIPS_APPEND_STATEWIDE_PLIPS",
    "PLIPS_APPEND_CITYWIDE_PLIPS",
  ];

  yield takeEvery(actions, function* ({ payload }) {
    try {
      const { plips } = payload;
      const plipIds = pluck("id", plips || []).filter(isNotNil);
      if (!plipIds.length) return;

      const results = yield plipIds.map(id => call(mobileApi.plipSignInfo, id))

      const signInfo = zip(plipIds, results).reduce((memo, [id, result]) => {
        memo[id] = result.info;
        return memo;
      }, {});
      yield put(plipsSingInfoFetched({ signInfo }));
    } catch(e) {
      logError(e, { tag: "fetchPlipsSignInfoSaga" });
    }
  });
}

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore, apiError, localStorage }) {
  yield spawn(fetchFilteredPlips);
  yield spawn(fetchFilteredPlipsNextPage);
  yield spawn(refreshFilteredPlips);
  yield spawn(fetchNationWidePlipsSaga, { mudamosWebApi });
  yield spawn(fetchStatewidePlipsSaga, { mudamosWebApi });
  yield spawn(fetchCitywidePlipsSaga, { mudamosWebApi });
  yield spawn(refreshNationwidePlipsSaga, { mudamosWebApi });
  yield spawn(refreshStatewidePlipsSaga, { mudamosWebApi });
  yield spawn(refreshCitywidePlipsSaga, { mudamosWebApi });
  yield spawn(fetchNationwidePlipsNextPageSaga, { mudamosWebApi });
  yield spawn(fetchStatewidePlipsNextPageSaga, { mudamosWebApi });
  yield spawn(fetchCitywidePlipsNextPageSaga, { mudamosWebApi });
  yield fork(fetchStoredPlipsFilters, { localStorage });
  yield fork(changePlipsFilter, { localStorage });
  yield spawn(changePlipsFilterState);
  yield spawn(changePlipsFilterCity);
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(updatePlipSignInfoSaga, { mobileApi });
  yield spawn(fetchPlipSignersSaga, { mobileApi });
  yield spawn(fetchPlipRelatedInfo, { mobileApi });
  yield spawn(fetchPlipsSignInfoSaga, { mobileApi });
}
