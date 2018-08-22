import { Alert } from "react-native";
import { all, call, spawn, put, select, fork, takeEvery, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";

import {
  isEmpty,
  prop,
  uniqBy,
  zip,
} from "ramda";

import {
  different,
  eligibleToSignPlip,
  homeSceneKey,
  isPresent,
  isDev,
  isUnauthorized,
  logError,
  moment,
} from "../utils";

import {
  allPlipsFetched,
  nationwidePlipsFetched,
  plipsByLocationFetched,
  signedPlipsFetched,
  favoritePlipsFetched,
  appReady,
  plipsFetchError,
  plipsFetchNextPageError,
  fetchPlipRelatedInfoError,
  fetchPlips,
  fetchingPlips,
  fetchingPlipRelatedInfo,
  fetchingPlipSigners,
  fetchPlipSignersError,
  fetchingShortPlipSigners,
  invalidatePhone,
  isAppReady,
  isRefreshingPlips,
  isSigningPlip,
  logEvent,
  navigate,
  plipsSignInfoFetched,
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
  getPlipSignatureGoals,
  isUserLoggedIn,
  getIneligiblePlipReasonForScope,
} from "../selectors";

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

function* fetchPlipsMainTab({ mobileApi }) {
  yield takeLatest("UPDATE_MAIN_TAB_VIEW_INDEX", function* () {
    const mainTabViewKey = yield select(getCurrentMainTabView);

    let plips = [];

    switch(mainTabViewKey) {
      case "allPlips": {
        plips = yield select(findAllPlips);
        break;
      }
      case "favoritePlips": {
        plips = yield select(findUserFavoritePlips);
        break;
      }
      case "nationwidePlips": {
        plips = yield select(findNationwidePlips);
        break;
      }
      case "signedPlips": {
        plips = yield select(findSignedPlips);
        break;
      }
      case "userLocationPlips": {
        plips = yield select(findUserLocationPlips);
        break;
      }
    }

    yield isEmpty(plips) && put(fetchPlips());;
  });
}

function* fetchPlipsSaga({ mobileApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      yield put(fetchingPlips(true));

      const mainTabViewKey = yield select(getCurrentMainTabView);

      let response = {};

      switch(mainTabViewKey) {
        case "allPlips": {
          response = yield call(fetchAllPlips, { mobileApi });
          break;
        }
        case "favoritePlips": {
          response = yield call(listFavoritePlips, { mobileApi });
          break;
        }
        case "nationwidePlips": {
          response = yield call(fetchNationwidePlips, { mobileApi });
          break;
        }
        case "signedPlips": {
          response = yield call(fetchSignedPlips, { mobileApi });
          break;
        }
        case "userLocationPlips": {
          response = yield call(fetchByUserLocationPlips, { mobileApi });
          break;
        }
      }

      yield all([
        (mainTabViewKey === "allPlips") ? put(refreshAllPlips(response)) : Promise.resolve(),
        (mainTabViewKey === "favoritePlips") ? put(refreshFavoritePlips(response)) : Promise.resolve(),
        (mainTabViewKey === "nationwidePlips") ? put(refreshNationwidePlips(response)) : Promise.resolve(),
        (mainTabViewKey === "signedPlips") ? put(refreshSignedPlips(response)) : Promise.resolve(),
        (mainTabViewKey === "userLocationPlips") ? put(refreshPlipsByLocation(response)) : Promise.resolve(),
        put(fetchingPlips(false)),
        !isAppReady ? put(appReady(true)) : Promise.resolve(),
      ]);

      const id = prop("id");
      const plips = response.plips;
      const uniqPlips = uniqBy(id, plips);
      const plipIds = uniqPlips.map(id);

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch (e) {
      logError(e);

      yield all([
        put(fetchingPlips(false)),
        put(plipsFetchError(e)),
        !isAppReady ? put(appReady(true)) : Promise.resolve(),
      ]);
    }
  });
}

function* fetchPlipsNextPageSaga({ mobileApi }) {
  yield takeLatest("FETCH_PLIPS_NEXT_PAGE", function* (action) {
    try {
      // debounce
      yield call(delay, 500);

      const { typeList, nextPage } = action.payload;

      const currentAllPlips = yield select(findAllPlips);
      const currentNationwidePlips = yield select(findNationwidePlips);
      const currentUserLocationPlips = yield select(findUserLocationPlips);
      const currentUserFavoritePlips = yield select(findUserFavoritePlips);
      const currentSignedPlips = yield select(findSignedPlips);

      let response = {};

      switch(typeList) {
        case "allPlips": {
          response = yield call(fetchAllPlips, { mobileApi, page: nextPage });
          yield put(allPlipsFetched(response));
          break;
        }
        case "favoritePlips": {
          response = yield call(listFavoritePlips, { mobileApi, page: nextPage });
          yield put(favoritePlipsFetched(response));
          break;
        }
        case "nationwidePlips": {
          response = yield call(fetchNationwidePlips, { mobileApi, page: nextPage });
          yield put(nationwidePlipsFetched(response));
          break;
        }
        case "signedPlips": {
          response = yield call(fetchSignedPlips, { mobileApi, page: nextPage });
          yield put(signedPlipsFetched(response));
          break;
        }
        case "userLocationPlips": {
          response = yield call(fetchByUserLocationPlips, { mobileApi, page: nextPage });
          yield put(plipsByLocationFetched(response));
          break;
        }
      }

      const plipIds = (response.plips || []).map(prop("id"));

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch (e) {
      logError(e);

      yield put(plipsFetchNextPageError(e));
    }
  });
}

function* refreshPlipsSaga({ mobileApi }) {
  yield takeLatest("PLIPS_REFRESH_PLIPS", function* (action) {
    try {
      const { typeList } = action.payload;

      yield put(isRefreshingPlips(true));

      let response = {};

      switch(typeList) {
        case "allPlips": {
          response = yield call(fetchAllPlips, { mobileApi, page: 0 });
          yield put(refreshAllPlips(response));
          break;
        }
        case "favoritePlips": {
          response = yield call(listFavoritePlips, { mobileApi, page: 0 });
          yield put(refreshFavoritePlips(response));
          break;
        }
        case "nationwidePlips": {
          response = yield call(fetchNationwidePlips, { mobileApi, page: 0 });
          yield put(refreshNationwidePlips(response));
          break;
        }
        case "signedPlips": {
          response = yield call(fetchSignedPlips, { mobileApi, page: 0 });
          yield put(refreshSignedPlips(response));
          break;
        }
        case "userLocationPlips": {
          response = yield call(fetchByUserLocationPlips, { mobileApi, page: 0 });
          yield put(refreshPlipsByLocation(response));
          break;
        }
      }

      const plipIds = (response.plips || []).map(prop("id"));

      yield all([
        call(fetchPlipsRelatedInfo, { mobileApi, plipIds }),
        put(isRefreshingPlips(false)),
      ]);
    } catch (e) {
      logError(e);

      yield all([
        put(plipsRefreshError(e)),
        put(isRefreshingPlips(false)),
      ]);
    }
  });
}

function* fetchNationwidePlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = "nationwide";
  const includeCauses = true;

  const response = yield call(mobileApi.listPlips, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return { ...response, plips: response.plips }
}

function* fetchByUserLocationPlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = "citywide";
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

  return { ...response, plips: response.plips }
}

function* fetchAllPlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = "all";
  const includeCauses = true;

  const response = yield call(mobileApi.listPlips, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return { ...response, plips: response.plips }
}

function* fetchSignedPlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = "all";
  const includeCauses = true;
  const authToken = yield select(currentAuthToken);

  const response = yield call(mobileApi.listSignedPlips, authToken, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return { ...response, plips: response.plips }
}

function* listFavoritePlips({ mobileApi, page = 0 }) {
  const limit = PLIPS_PER_PAGE;
  const scope = "all";
  const includeCauses = true;
  const authToken = yield select(currentAuthToken);

  const response = yield call(mobileApi.listFavoritePlips, authToken, {
    includeCauses,
    limit,
    page,
    scope,
  });

  return { ...response, plips: response.plips }
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

      yield all([
        call(fetchPlipsRelatedInfo, { mobileApi, plipIds: [plipId] }),
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

      yield put(isSigningPlip(true));

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) {
        yield put(logEvent({ name: "signup_through_sign_button" }));
        return yield put(navigate("signIn"));
      }

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

      const isElegible = yield call(eligibleToSignPlip, { user, plip });

      if (!isElegible) {
        const reason = yield select(getIneligiblePlipReasonForScope(plip.scopeCoverage.scope));

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

        // Update Signed Plips
        const signedPlips = yield call(fetchSignedPlips, { mobileApi, page: 0 });
        yield put(signedPlipsFetched(signedPlips));
        const plipIds = (signedPlips.plips || []).map(prop("id"));
        yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });

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

function* fetchPlipsRelatedInfo({ mobileApi, plipIds }) {
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

    yield put(plipsSignInfoFetched({ signInfo }));
  } catch(e) {
    logError(e, { tag: "fetchPlipsRelatedInfo" });
  }
}

function* fetchPlipsSignInfo({ mobileApi, plipIds }) {
  const authToken = yield select(currentAuthToken);
  const goals = yield all(plipIds.map(id => select(getPlipSignatureGoals(id))));

  const calls = zip(plipIds, goals)
    .map(([plipId, { initialGoal, finalGoal }]) =>
      call(mobileApi.plipSignInfo, { authToken, plipId, initialGoal, finalGoal }));

  return yield all(calls);
}

function* fetchPlipsUserSignInfo({ mobileApi, plipIds }) {
  return yield all(plipIds.map(plipId => call(fetchUserSignInfo, { mobileApi, plipId })));
}

function* loadStorePlipsInfo() {
  let oldUserLocation;

  yield takeLatest("SESSION_LOGGIN_SUCCEEDED", function* () {
    yield put(fetchPlips());
  });

  yield takeLatest("SESSION_USER_LOGGED_OUT", function* () {
    yield put(fetchPlips());
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
          yield put(fetchPlips());
        }

        return;
      }

      if (different(newLocation, oldUserLocation)) {
        oldUserLocation = newLocation;
        yield put(fetchPlips());
      }
    } catch(e) {
      logError(e, { tag: "loadStorePlipsInfo" });
    }
  });
}

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore, apiError }) {
  yield fork(fetchPlipsMainTab, { mobileApi });
  yield fork(fetchPlipsSaga, { mobileApi });
  yield fork(refreshPlipsSaga, { mobileApi });
  yield fork(fetchPlipsNextPageSaga, { mobileApi });
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(updatePlipSignInfoSaga, { mobileApi });
  yield spawn(fetchPlipSignersSaga, { mobileApi });
  yield spawn(fetchPlipRelatedInfo, { mobileApi });
  yield fork(fetchAllPlips, { mobileApi })
  yield fork(loadStorePlipsInfo);
}
