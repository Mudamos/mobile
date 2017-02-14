import { takeEvery, takeLatest } from "redux-saga";
import { call, spawn, put, select } from "redux-saga/effects";

import {
  homeSceneKey,
  isDev,
  isUnauthorized,
  logError,
  moment,
} from "../utils";

import {
  appReady,
  plipsFetchPlipsNextPageError,
  fetchPlipRelatedInfoError,
  fetchingNextPlipsPage,
  fetchingPlips,
  fetchingPlipRelatedInfo,
  fetchingPlipSigners,
  fetchPlipSignersError,
  fetchingPlipSignInfo,
  fetchingShortPlipSigners,
  fetchingUserSignInfo,
  invalidatePhone,
  isRefreshingPlips,
  isSigningPlip,
  navigate,
  plipsAppendPlips,
  plipsFetched,
  plipsFetchError,
  plipJustSigned,
  plipsRefreshError,
  plipSigners,
  plipSignError,
  plipSignInfoFetched,
  plipUserSignInfo,
  profileStateMachine,
  signPlip as signPlipAction,
  signingPlip,
  shortPlipSigners,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  getCurrentSigningPlip,
  isUserLoggedIn,
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

export function* fetchPlipsSaga({ mudamosWebApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      yield put(fetchingPlips(true));
      const response = yield call(fetchPlips, { mudamosWebApi });
      yield put(plipsFetched(response));

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

export function* fetchPlipsNextPageSaga({ mudamosWebApi }) {
  yield takeLatest("PLIPS_FETCH_PLIPS_NEXT_PAGE", function* ({ payload }) {
    try {
      const { page } = payload;

      yield put(fetchingNextPlipsPage(true));
      const response = yield call(fetchPlips, { page, mudamosWebApi });

      yield put(plipsAppendPlips(response));
    } catch (e) {
      logError(e);

      yield put(plipsFetchPlipsNextPageError(e));
    } finally {
      yield put(fetchingNextPlipsPage(false));
    }
  });
}

function* fetchPlips({ mudamosWebApi, page = 1 }) {
  return yield call(mudamosWebApi.listPlips, { page });
}

export function* refreshPlips({ mudamosWebApi }) {
  yield takeLatest("PLIPS_REFRESH_PLIPS", function* () {
    try {
      yield put(isRefreshingPlips(true));
      const response = yield call(fetchPlips, { page: 1, mudamosWebApi });
      yield put(plipsFetched(response));
    } catch (e) {
      logError(e);

      yield put(plipsRefreshError(e));
    } finally {
      yield put(isRefreshingPlips(false));
    }
  });
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
      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(fetchingPlipRelatedInfo(false));
      yield put(fetchPlipRelatedInfoError(e));
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
      if (isUnauthorized(e)) return yield put(unauthorized());
      yield put(fetchPlipSignersError(e));
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

      const difficulty = yield call(mobileApi.difficulty, authToken);

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

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore, apiError }) {
  yield spawn(fetchPlipsSaga, { mudamosWebApi });
  yield spawn(refreshPlips, { mudamosWebApi });
  yield spawn(fetchPlipsNextPageSaga, { mudamosWebApi });
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(updatePlipSignInfoSaga, { mobileApi });
  yield spawn(fetchPlipSignersSaga, { mobileApi });
  yield spawn(fetchPlipRelatedInfo, { mobileApi });
}
