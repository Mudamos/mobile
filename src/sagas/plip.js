import { Alert } from "react-native";
import { all, call, spawn, put, select, fork, takeEvery, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";

import {
  chain,
  identity,
  prop,
  splitEvery,
  take,
  zip,
} from "ramda";

import {
  different,
  homeSceneKey,
  isBlank,
  isDev,
  isUnauthorized,
  logError,
  moment,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
} from "../utils";

import {
  isNationalCause,
} from "../models";

import {
  allPlipsFetched,
  appReady,
  plipsFetchError,
  plipsFetchNextPageError,
  plipsFetched,
  fetchPlipRelatedInfoError,
  fetchingPlips,
  fetchingPlipRelatedInfo,
  fetchingPlipSigners,
  fetchPlipSignersError,
  fetchingShortPlipSigners,
  invalidatePhone,
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
  signPlip as signPlipAction,
  signingPlip,
  shortPlipSigners,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  findPlips,
  getCurrentSigningPlip,
  getPlipSignatureGoals,
  getCurrentPlipsPage,
  getNextPlipsPage,
  listAllPlips,
  sortPlips,
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
  plip.cycle.name,
  plip.id,
].join(";");

const PLIPS_PER_PAGE = 4;

function* paginatePlips({ plips }) {
  const allPlips = yield select(sortPlips(plips || []));
  const paginate = take(PLIPS_PER_PAGE);

  return {
    page: 1,
    nextPage: allPlips.length > PLIPS_PER_PAGE ? 2 : null,
    plips: paginate(allPlips),
  };
}

function* fetchPlipsSaga({ mobileApi, mudamosWebApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      yield put(fetchingPlips(true));
      const response = yield call(fetchPlips, { mudamosWebApi });
      const paginatedPlips = yield call(paginatePlips, response);

      yield all([
        put(allPlipsFetched(response)),
        put(plipsFetched(paginatedPlips)),
      ]);

      const plipIds = (paginatedPlips.plips || []).map(prop("id"));

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });

      yield put(fetchingPlips(false));
    } catch (e) {
      logError(e);

      yield put(fetchingPlips(false));
      yield put(plipsFetchError(e));
    } finally {
      yield put(appReady(true));
    }
  });
}

function* fetchPlipsNextPageSaga({ mobileApi }) {
  yield takeLatest("FETCH_PLIPS_NEXT_PAGE", function* () {
    console.log("FETCH_PLIPS_NEXT_PAGE")
    try {
      // debounce
      yield call(delay, 500);

      const response = yield call(plipsNextPage);
      yield put(plipsFetched(response));

      const plipIds = (response.plips || []).map(prop("id"));

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch (e) {
      logError(e);

      yield put(plipsFetchNextPageError(e));
    }
  });
}

function* refreshPlipsSaga({ mobileApi, mudamosWebApi }) {
  yield takeLatest("PLIPS_REFRESH_PLIPS", function* () {
    try {
      yield put(isRefreshingPlips(true));
      const response = yield call(fetchPlips, { page: 1, mudamosWebApi });
      const paginatedPlips = yield call(paginatePlips, response);

      yield all([
        put(allPlipsFetched(response)),
        put(plipsFetched(paginatedPlips)),
      ]);

      const plipIds = (paginatedPlips.plips || []).map(prop("id"));

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch (e) {
      logError(e);

      yield put(plipsRefreshError(e));
    } finally {
      yield put(isRefreshingPlips(false));
    }
  });
}

function* fetchPlips({ mudamosWebApi, page = 1, uf, cityId }) {
  // Because we are ordering client side, we must fetch "all" plips
  const limit = 100;
  const scope = "all";
  const includeCauses = true;

  return yield call(mudamosWebApi.listPlips, {
    cityId,
    includeCauses,
    limit,
    page,
    scope,
    uf,
  });
}

function* plipsNextPage() {
  const allPlips = yield select(listAllPlips);
  const { plips, nextPage, currentPage } = yield all({
    plips: select(sortPlips(allPlips)),
    nextPage: select(getNextPlipsPage),
    currentPage: select(getCurrentPlipsPage),
  });

  if (!nextPage) {
    return { page: currentPage, nextPage: null, plips: [] };
  }

  const compact = chain(identity);
  const paginatedPlips = splitEvery(PLIPS_PER_PAGE, plips);
  const currentPlips = take(nextPage, paginatedPlips);
  const hasNext = (paginatedPlips[nextPage + 1] || []).length > 0;

  return {
    page: nextPage,
    nextPage: hasNext ? nextPage + 1 : null,
    plips: compact(currentPlips),
  };
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
        return yield put(navigate("signUp"));
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

function* loadStorePlipsInfo({ mobileApi }) {
  let oldUserLocation;

  function* fetch() {
    try {
      const plips = yield select(findPlips);
      const plipIds = (plips || []).map(prop("id"));
      if (!plipIds.length) return;

      yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds });
    } catch(e) {
      logError(e, { tag: "loadStorePlipsInfo" });
    }
  }

  yield takeLatest(["SESSION_LOGGIN_SUCCEEDED", "SESSION_USER_LOGGED_OUT"], function* () {
   yield call(fetch);
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
        return;
      }

      if (different(newLocation, oldUserLocation)) {
        yield call(fetch);
      }
    } catch(e) {
      logError(e, { tag: "loadStorePlipsInfo" });
    }
  });
}

function eligibleToSignPlip({ plip, user }) {
  const { scope, uf, city } = plip.scopeCoverage;
  const { uf: userUF, city: userCityName } = user.address;

  const matchUF = () => userUF.toLowerCase() === uf.toLowerCase();
  const matchCity = () => userUF.toLowerCase() === city.uf.toLowerCase() && userCityName.toLowerCase() === city.name.toLowerCase();

  switch (scope) {
    case NATIONWIDE_SCOPE: return true;
    case STATEWIDE_SCOPE: return isBlank(userUF) || isNationalCause(plip) || matchUF();
    case CITYWIDE_SCOPE: return isBlank(userCityName) || isNationalCause(plip) || matchCity();
  }
}

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore, apiError }) {
  yield fork(fetchPlipsSaga, { mobileApi, mudamosWebApi });
  yield fork(refreshPlipsSaga, { mobileApi, mudamosWebApi });
  yield fork(fetchPlipsNextPageSaga, { mobileApi });
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(updatePlipSignInfoSaga, { mobileApi });
  yield spawn(fetchPlipSignersSaga, { mobileApi });
  yield spawn(fetchPlipRelatedInfo, { mobileApi });
  yield fork(loadStorePlipsInfo, { mobileApi });
}
