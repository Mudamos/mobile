import { Alert } from "react-native";
import { all, call, spawn, put, select, fork, takeEvery, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";

import {
  isEmpty,
  prop,
  uniq,
  zip,
} from "ramda";

import {
  ALL_SCOPE,
  CITYWIDE_SCOPE,
  NATIONWIDE_SCOPE,
  different,
  eligibleToSignPlip,
  homeSceneKey,
  isBlank,
  isPresent,
  isDev,
  isUnauthorized,
  logError,
  moment,
} from "../utils";

import {
  allPlipsError,
  nationwidePlipsError,
  plipsByLocationError,
  signedPlipsError,
  favoritePlipsError,
  allPlipsFetched,
  nationwidePlipsFetched,
  plipsByLocationFetched,
  signedPlipsFetched,
  favoritePlipsFetched,
  resetUserPlips,
  resetUserLocationPlips,
  appReady,
  plipsFetchNextPageError,
  fetchPlipRelatedInfoError,
  fetchPlips,
  refreshingAllPlips,
  refreshingNationwidePlips,
  refreshingPlipsByLocation,
  refreshingSignedPlips,
  refreshingFavoritePlips,
  fetchingAllPlips,
  fetchingNationwidePlips,
  fetchingPlipsByLocation,
  fetchingSignedPlips,
  fetchingFavoritePlips,
  fetchingAllPlipsNextPage,
  fetchingNationwidePlipsNextPage,
  fetchingPlipsByLocationNextPage,
  fetchingSignedPlipsNextPage,
  fetchingFavoritePlipsNextPage,
  fetchingPlipRelatedInfo,
  fetchingPlipSigners,
  fetchPlipSignersError,
  fetchingShortPlipSigners,
  increaseAppLoading,
  invalidatePhone,
  isAddingFavoritePlip,
  isSearchingPlip,
  clearSearchPlip,
  logEvent,
  navigate,
  plipsSignInfoFetched,
  plipsFavoriteInfoFetched,
  plipJustSigned,
  plipsRefreshError,
  plipSigners,
  plipSignError,
  plipUserSignInfo,
  profileStateMachine,
  refreshAllPlips,
  refreshNationwidePlips,
  refreshPlipsByLocation,
  refreshSignedPlips,
  refreshFavoritePlips,
  signPlip as signPlipAction,
  signingPlip,
  shortPlipSigners,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  currentUserCity,
  currentUserUf,
  findAllPlips,
  findNationwidePlips,
  findUserLocationPlips,
  findUserFavoritePlips,
  findSignedPlips,
  getCurrentMainTabView,
  getCurrentSigningPlip,
  isAppReady,
  isUserLoggedIn,
  getIneligiblePlipReasonForScope,
  searchPlipTitle,
} from "../selectors";

import {
  getMainTabViewKeyByIndex,
} from "../models";

import { fetchProfile } from "./profile";
import { profileScreenForCurrentUser } from "./navigation";
import { validateLocalWallet } from "./wallet";

import LibCrypto from "mudamos-libcrypto";

const buildSignMessage = ({ user, plip }) => [
  user.name,
  user.zipCode,
  user.voteCard,
  moment().toISOString(),
  plip.title,
  plip.id,
].join(";");

const PLIPS_PER_PAGE = 4;

function* getPlips(key) {
  switch(key) {
    case "allPlips":
      return yield select(findAllPlips);
    case "favoritePlips":
      return yield select(findUserFavoritePlips);
    case "nationwidePlips":
      return yield select(findNationwidePlips);
    case "signedPlips":
      return yield select(findSignedPlips);
    case "userLocationPlips":
      return yield select(findUserLocationPlips);
    default:
      return [];
  }
}

function* fetchPlipsMainTab() {
  yield takeLatest("UPDATE_MAIN_TAB_VIEW_INDEX", function* (action) {
    const { index } = action.payload;

    const mainTabViewKey = getMainTabViewKeyByIndex(index);

    const plips = yield call(getPlips, mainTabViewKey);

    if (isEmpty(plips)) {
      yield put(fetchPlips());
    }
  });
}

function* fetch({ mobileApi, key  }) {
  switch(key) {
    case "allPlips":
      return yield call(fetchAllPlips, { mobileApi });
    case "favoritePlips":
      return yield call(listFavoritePlips, { mobileApi });
    case "nationwidePlips":
      return yield call(fetchNationwidePlips, { mobileApi });
    case "signedPlips":
      return yield call(fetchSignedPlips, { mobileApi });
    case "userLocationPlips":
      return yield call(fetchByUserLocationPlips, { mobileApi });
    default:
      return;
  }
}

function* setPlipError({ key, error }) {
  switch(key) {
    case "allPlips":
      return yield put(allPlipsError(error));
    case "favoritePlips":
      return yield put(favoritePlipsError(error));
    case "nationwidePlips":
      return yield put(nationwidePlipsError(error));
    case "signedPlips":
      return yield put(signedPlipsError(error));
    case "userLocationPlips":
      return yield put(plipsByLocationError(error));
    default:
      return;
  }
}

function* fetchingPlips({ key, status }) {
  switch(key) {
    case "allPlips":
      return yield put(fetchingAllPlips(status));
    case "favoritePlips":
      return yield put(fetchingFavoritePlips(status));
    case "nationwidePlips":
      return yield put(fetchingNationwidePlips(status));
    case "signedPlips":
      return yield put(fetchingSignedPlips(status));
    case "userLocationPlips":
      return yield put(fetchingPlipsByLocation(status));
    default:
      return;
  }
}

function* refreshingPlips({ key, status }) {
  switch(key) {
    case "allPlips":
      return yield put(refreshingAllPlips(status));
    case "favoritePlips":
      return yield put(refreshingFavoritePlips(status));
    case "nationwidePlips":
      return yield put(refreshingNationwidePlips(status));
    case "signedPlips":
      return yield put(refreshingSignedPlips(status));
    case "userLocationPlips":
      return yield put(refreshingPlipsByLocation(status));
    default:
      return;
  }
}

function* fetchingNextPage({ key, status }) {
  switch(key) {
    case "allPlips":
      return yield put(fetchingAllPlipsNextPage(status));
    case "favoritePlips":
      return yield put(fetchingFavoritePlipsNextPage(status));
    case "nationwidePlips":
      return yield put(fetchingNationwidePlipsNextPage(status));
    case "signedPlips":
      return yield put(fetchingSignedPlipsNextPage(status));
    case "userLocationPlips":
      return yield put(fetchingPlipsByLocationNextPage(status));
    default:
      return;
  }
}

function* fetchPlipsSaga({ mobileApi }) {
  yield takeEvery("FETCH_PLIPS", function* (action) {
    const { shouldIncreaseAppLoading } = action && action.payload || {};
    const isReady = yield select(isAppReady);
    const mainTabViewKey = yield select(getCurrentMainTabView);

    yield call(fetchingPlips, { key: mainTabViewKey, status: true });

    try {
      const response = yield call(fetch, { mobileApi, key: mainTabViewKey });

      yield all([
        (mainTabViewKey === "allPlips") ? put(refreshAllPlips(response)) : Promise.resolve(),
        (mainTabViewKey === "favoritePlips") ? put(refreshFavoritePlips(response)) : Promise.resolve(),
        (mainTabViewKey === "nationwidePlips") ? put(refreshNationwidePlips(response)) : Promise.resolve(),
        (mainTabViewKey === "signedPlips") ? put(refreshSignedPlips(response)) : Promise.resolve(),
        (mainTabViewKey === "userLocationPlips") ? put(refreshPlipsByLocation(response)) : Promise.resolve(),
      ]);

      const id = prop("id");
      const detailId = prop("detailId");

      const plips = response.plips || [];
      const plipIds = plips.map(id);
      const plipDetailIds = plips.map(detailId);

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds, plipDetailIds });
    } catch (e) {
      logError(e);

      yield call(setPlipError, { key: mainTabViewKey, error: e });
    }

    if (shouldIncreaseAppLoading) {
      yield put(increaseAppLoading());
    }

    yield all([
      call(fetchingPlips, { key: mainTabViewKey, status: false }),
      !isReady ? put(appReady(true)) : Promise.resolve(),
    ]);
  });
}

function* fetchNextPage({ mobileApi, key, nextPage }) {
  switch(key) {
    case "allPlips": {
      const title = yield select(searchPlipTitle);
      const response = yield call(fetchAllPlips, { mobileApi, page: nextPage, title });
      yield put(allPlipsFetched(response));
      return response;
    }
    case "favoritePlips": {
      const response = yield call(listFavoritePlips, { mobileApi, page: nextPage });
      yield put(favoritePlipsFetched(response));
      return response;
    }
    case "nationwidePlips": {
      const response = yield call(fetchNationwidePlips, { mobileApi, page: nextPage });
      yield put(nationwidePlipsFetched(response));
      return response;
    }
    case "signedPlips": {
      const response = yield call(fetchSignedPlips, { mobileApi, page: nextPage });
      yield put(signedPlipsFetched(response));
      return response;
    }
    case "userLocationPlips": {
      const response = yield call(fetchByUserLocationPlips, { mobileApi, page: nextPage });
      yield put(plipsByLocationFetched(response));
      return response;
    }
  }
}

function* fetchPlipsNextPageSaga({ mobileApi }) {
  yield takeEvery("FETCH_PLIPS_NEXT_PAGE", function* (action) {
    const { typeList, nextPage } = action.payload;

    try {
      // debounce
      yield call(delay, 500);

      yield call(fetchingNextPage, { key: typeList, status: true });

      const response = yield call(fetchNextPage, { mobileApi, key: typeList, nextPage });

      const id = prop("id");
      const detailId = prop("detailId");

      const plips = response.plips || [];
      const plipIds = plips.map(id);
      const plipDetailIds = plips.map(detailId);

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds, plipDetailIds });
    } catch (e) {
      logError(e, { tag: `${typeList} nextPage(${nextPage})` });

      yield all([
        put(plipsFetchNextPageError(e)),
        call(fetchingNextPage, { key: typeList, status: false }),
      ]);
    }
  });
}

function* refreshPlips({ mobileApi, key }) {
  switch(key) {
    case "allPlips": {
      const response = yield call(fetchAllPlips, { mobileApi, page: 0 });
      yield put(refreshAllPlips(response));
      return response;
    }
    case "favoritePlips": {
      const response = yield call(listFavoritePlips, { mobileApi, page: 0 });
      yield put(refreshFavoritePlips(response));
      return response;
    }
    case "nationwidePlips": {
      const response = yield call(fetchNationwidePlips, { mobileApi, page: 0 });
      yield put(refreshNationwidePlips(response));
      return response;
    }
    case "signedPlips": {
      const response = yield call(fetchSignedPlips, { mobileApi, page: 0 });
      yield put(refreshSignedPlips(response));
      return response;
    }
    case "userLocationPlips": {
      const response = yield call(fetchByUserLocationPlips, { mobileApi, page: 0 });
      yield put(refreshPlipsByLocation(response));
      return response;
    }
  }
}

function* refreshPlipsSaga({ mobileApi }) {
  yield takeEvery("PLIPS_REFRESH_PLIPS", function* (action) {
    const { typeList } = action.payload;

    try {
      yield call(refreshingPlips, { key: typeList, status: true });

      const response = yield call(refreshPlips, { mobileApi, key: typeList});

      const id = prop("id");
      const detailId = prop("detailId");

      const plips = response.plips || [];
      const plipIds = plips.map(id);
      const plipDetailIds = plips.map(detailId);

      yield all([
        put(clearSearchPlip()),
        call(fetchPlipsRelatedInfo, { mobileApi, plipIds, plipDetailIds }),
        call(refreshingPlips, { key: typeList, status: false }),
      ]);
    } catch (e) {
      logError(e, { tag: `${typeList} refresh` });

      yield all([
        put(plipsRefreshError(e)),
        call(refreshingPlips, { key: typeList, status: false } ),
      ]);
    }
  });
}

function* fetchNationwidePlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = NATIONWIDE_SCOPE;
  const includeCauses = true;

  const response = yield call(mobileApi.listPlips, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return response;
}

function* fetchByUserLocationPlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = CITYWIDE_SCOPE;
  const city = yield select(currentUserCity);
  const uf = yield select(currentUserUf);
  const includeCauses = true;

  const response = yield call(mobileApi.listPlips, {
    city,
    uf,
    includeCauses,
    limit,
    page,
    scope,
  });

  return response;
}

function* fetchAllPlips({ mobileApi, page = 0, title = "" }) {
  const limit = PLIPS_PER_PAGE;
  const scope = ALL_SCOPE;
  const includeCauses = true;
  const search = isBlank(title) ? null : title;

  const response = yield call(mobileApi.listPlips, {
    includeCauses,
    limit,
    page,
    scope,
    search,
  });

  return response;
}

function* fetchAllPlipsSafe({ mobileApi }) {
  try {
    return yield call(fetchAllPlips, { mobileApi });
  } catch(e) {
    logError(e);
  }
}

function* fetchSignedPlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = ALL_SCOPE;
  const includeCauses = true;
  const authToken = yield select(currentAuthToken);

  const response = yield call(mobileApi.listSignedPlips, authToken, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return response;
}

function* listFavoritePlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = ALL_SCOPE;
  const includeCauses = true;
  const authToken = yield select(currentAuthToken);

  const response = yield call(mobileApi.listFavoritePlips, authToken, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return response
}

function* fetchPlipRelatedInfo({ mobileApi }) {
  yield takeLatest("PLIP_FETCH_PLIP_RELATED_INFO", function* ({ payload }) {
    try {
      yield put(fetchingPlipRelatedInfo(true));
      const { plipId } = payload;

      yield all([
        call(fetchPlipsRelatedInfo, { mobileApi, plipIds: [plipId] }),
        call(fetchShortSigners, { mobileApi, plipId }),
      ]);

      yield put(fetchingPlipRelatedInfo(false));

      const currentSigningPlip = yield select(getCurrentSigningPlip);
      if (currentSigningPlip) {
        // Instantly try to sign the plip after loading the page
        yield put(signPlipAction({ plip: currentSigningPlip }));
      }
    } catch (e) {
      logError(e, { tag: "fetchPlipRelatedInfo" });

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
  const authToken = yield select(currentAuthToken);

  const userSignInfo = yield call(mobileApi.userSignInfo, authToken, plipId);
  yield put(plipUserSignInfo({ plipId, info: userSignInfo.signMessage }));
}

function* updatePlipSignInfoSaga({ mobileApi }) {
  yield takeEvery("PLIP_JUST_SIGNED", function* ({ payload }) {
    try {
      const { plipId } = payload;

      const signedPlips = yield call(fetchSignedPlips, { mobileApi, page: 0 });
      yield put(signedPlipsFetched(signedPlips));
      const signedPlipIds = (signedPlips.plips || []).map(prop("id"));
      const plipIds = uniq([...signedPlipIds, plipId])

      yield all([
        call(fetchPlipsRelatedInfo, { mobileApi, plipIds }),
        call(fetchShortSigners, { mobileApi, plipId }),
      ]);
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

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) {
        yield put(logEvent({ name: "signup_through_sign_button" }));
        return yield put(navigate("signIn"));
      }

      const validWallet = yield call(validateLocalWallet, { walletStore });
      if (!validWallet) {
        if (isDev) console.log("Local wallet is invalid");
        return yield call(invalidateWalletAndNavigate, { revalidateProfileSignPlip: true });
      }

      // Check profile completion
      const { key: screenKey } = yield call(profileScreenForCurrentUser);

      if (screenKey !== homeSceneKey) return yield put(navigate(screenKey, { type: "reset" }));

      const authToken = yield select(currentAuthToken);

      const seed = yield call(walletStore.retrieve, user.voteCard);
      if (isDev) console.log("Acquired seed", seed);
      if (!seed) return yield call(invalidateWalletAndNavigate, { revalidateProfileSignPlip: true });

      const isElegible = yield call(eligibleToSignPlip, { user, plip });

      if (!isElegible) {
        const reason = yield select(getIneligiblePlipReasonForScope(plip.scopeCoverage));

        Alert.alert(
          null,
          reason,
          [{ text: "OK" }]
        );

        return;
      }

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

        if (apiError.isInvalidWallet(e)) return yield call(invalidateWalletAndNavigate, { revalidateProfileSignPlip: true });

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
    } finally {
      yield put(signingPlip(null));
    }
  });
}

function* invalidateWalletAndNavigate(params = {}) {
  yield put(invalidatePhone());
  yield put(profileStateMachine(params));
}

function* fetchPlipsRelatedInfo({ mobileApi, plipIds, plipDetailIds }) {
  try {
    if (!plipIds || !plipIds.length) return;

    const loggedIn = yield select(isUserLoggedIn);

    const [plipSignResults] = yield all([
      call(fetchPlipsSignInfo, { mobileApi, plipIds }),
      loggedIn ? call(fetchPlipsUserSignInfo, { mobileApi, plipIds }) : Promise.resolve(),
    ]);

    const signInfo = zip(plipIds, plipSignResults).reduce((memo, [id, result]) => {
      memo[id] = result.info;
      return memo;
    }, {});

    const plipFavoriteResults = loggedIn && plipDetailIds ? yield call(fetchUserFavoriteInfo, { mobileApi, plipDetailIds }) : [];

    const favoriteInfo = zip(plipDetailIds || [], plipFavoriteResults).reduce((memo, [id, result]) => {
      memo[id] = result.favorite;
      return memo;
    }, {});

    yield all([
      put(plipsSignInfoFetched({ signInfo })),
      plipDetailIds ? put(plipsFavoriteInfoFetched({ favoriteInfo })) : Promise.resolve(),
    ]);
  } catch(e) {
    logError(e, { tag: "fetchPlipsRelatedInfo" });
  }
}

function* fetchPlipsSignInfo({ mobileApi, plipIds }) {
  const authToken = yield select(currentAuthToken);

  const calls = plipIds
    .map(plipId => call(mobileApi.plipSignInfo, { authToken, plipId }));

  return yield all(calls);
}

function* fetchPlipsUserSignInfo({ mobileApi, plipIds }) {
  return yield all(plipIds.map(plipId => call(fetchUserSignInfo, { mobileApi, plipId })));
}

function* fetchUserFavoriteInfo({ mobileApi, plipDetailIds }) {
  const authToken = yield select(currentAuthToken);

  const calls = plipDetailIds
    .map(detailId =>
      call(mobileApi.userFavoriteInfo, authToken, { detailId }));

  return yield all(calls);
}

function* toggleFavoritePlipSaga({ mobileApi }) {
  yield takeEvery("TOGGLE_FAVORITE", function* (action) {
    try {
      const { detailId } = action.payload;
      const authToken = yield select(currentAuthToken);
      const loggedIn = yield select(isUserLoggedIn);

      if (!loggedIn) {
        yield put(isAddingFavoritePlip(false));
        return;
      }

      const response = yield call(mobileApi.toggleFavoritePlip, authToken, { detailId });

      const favoriteInfo = { [detailId]: response.favorite };

      yield all([
        put(plipsFavoriteInfoFetched({ favoriteInfo })),
        call(refreshPlips, { mobileApi, key: "favoritePlips" }),
      ]);

    } catch(e) {
      logError(e, { tag: "toggleFavoritePlipSaga" });
    }

    yield put(isAddingFavoritePlip(false));
  });
}

function * searchPlips({ mobileApi }) {
  yield takeLatest("SEARCH_PLIP", function* (action) {
    try {
      yield call(delay, 1000);

      const { title } = action.payload;

      const response = yield call(fetchAllPlips, { mobileApi, page: 0, title });

      yield all([
        put(refreshAllPlips(response)),
        put(isSearchingPlip(false)),
      ]);

      const id = prop("id");
      const plips = response.plips;
      const plipIds = plips.map(id);

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch(e) {
      logError(e, { tag: "searchPlip" });

      yield put(isSearchingPlip(false));
    }
  });
}

function* loadStorePlipsInfo() {
  let oldUserLocation;

  yield takeLatest("SESSION_LOGGIN_SUCCEEDED", function* () {
    yield put(resetUserPlips());
    yield put(fetchPlips());
  });

  yield takeLatest("SESSION_USER_LOGGED_OUT", function* () {
    yield put(resetUserPlips());
    yield put(fetchPlips());
    oldUserLocation = null;
  });

  yield takeLatest("PROFILE_USER_UPDATED", function* ({ payload: { currentUser }}) {
    try {
      if (!currentUser) {
        oldUserLocation = null;
        return;
      }

      const newLocation = { uf: currentUser.address.uf, city: currentUser.address.city };

      if (!oldUserLocation) {
        oldUserLocation = newLocation;

        if (isPresent(newLocation.uf) && isPresent(newLocation.city)) {
          yield put(resetUserLocationPlips());
          yield put(fetchPlips());
        }

        return;
      }

      if (different(newLocation, oldUserLocation)) {
        oldUserLocation = newLocation;
        yield put(resetUserLocationPlips());
        yield put(fetchPlips());
      }
    } catch(e) {
      logError(e, { tag: "loadStorePlipsInfo" });
    }
  });
}

export default function* plipSaga({ mobileApi, walletStore, apiError }) {
  yield fork(searchPlips, { mobileApi });
  yield fork(fetchPlipsMainTab);
  yield fork(fetchPlipsSaga, { mobileApi });
  yield fork(refreshPlipsSaga, { mobileApi });
  yield fork(fetchPlipsNextPageSaga, { mobileApi });
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(updatePlipSignInfoSaga, { mobileApi });
  yield spawn(fetchPlipSignersSaga, { mobileApi });
  yield spawn(fetchPlipRelatedInfo, { mobileApi });
  yield fork(toggleFavoritePlipSaga, { mobileApi });
  yield fork(loadStorePlipsInfo);

  yield fork(fetchAllPlipsSafe, { mobileApi });
}
