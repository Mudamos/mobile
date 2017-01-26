import { takeEvery, takeLatest } from "redux-saga";
import { call, spawn, put, select } from "redux-saga/effects";

import {
  first,
  isDev,
  isUnauthorized,
  logError,
  moment,
} from "../utils";

import {
  fetchingPlips,
  fetchingPlipSignInfo,
  fetchingShortPlipSigners,
  fetchingUserSignInfo,
  invalidatePhone,
  isSigningPlip,
  navigate,
  plipsFetched,
  plipsFetchError,
  plipJustSigned,
  plipSignError,
  plipSignInfoFetched,
  plipUserSignInfo,
  profileStateMachine,
  setCurrentPlip,
  shortPlipSigners,
  unauthorized,
} from "../actions";

import {
  currentAuthToken,
  findPlips,
  isUserLoggedIn,
} from "../selectors";

import { fetchProfile } from "./profile";
import { profileScreenForCurrentUser } from "./navigation";

import LibCrypto from "mudamos-libcrypto";

const buildSignMessage = ({ user, plip }) => [
  user.name,
  user.zipCode,
  user.voteCard,
  moment().toISOString(),
  plip.cycle.name,
  plip.id,
].join(";");

export function* fetchPlips({ mobileApi, mudamosWebApi }) {
  yield takeLatest("FETCH_PLIPS", function* () {
    try {
      yield put(fetchingPlips(true));

      // TODO: remove the user sign info from here.
      // For now we can easily do this because of the MVP
      // Later we need to fire another action.
      //
      // This helps now because we can handle the error in a single
      // point of failure.
      const plips = (yield select(findPlips)) || (yield call(mudamosWebApi.listPlips));
      yield put(plipsFetched(plips));
      const currentPlip = first(plips);
      yield put(setCurrentPlip(currentPlip));

      yield call(fetchPlipRelatedInfo, { mobileApi, plipId: currentPlip && currentPlip.id });

      yield put(fetchingPlips(false));
    } catch(e) {
      logError(e);

      yield put(fetchingPlips(false));

      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(plipsFetchError(e));
    }
  });
}

function* fetchPlipRelatedInfo({ mobileApi, plipId }) {
  const loggedIn = yield select(isUserLoggedIn);
  const willFetchUserInfo = loggedIn && plipId;

  yield [
    willFetchUserInfo ? call(fetchUserSignInfo, { mobileApi, plipId }) : Promise.resolve(),
    call(fetchPlipSignInfo, { mobileApi, plipId }),
    plipId ? call(fetchShortSigners, { mobileApi, plipId }) : Promise.resolve(),
  ];
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

function* fetchPlipSignInfoSaga({ mobileApi }) {
  yield takeEvery("PLIP_JUST_SIGNED", function* ({ payload }) {
    try {
      const { plipId } = payload;
      yield call(fetchPlipSignInfo, { mobileApi, plipId });
    } catch(e) {
      logError(e);
    }
  });
}

function* signPlip({ mobileApi, walletStore, apiError }) {
  yield takeLatest("PLIP_SIGN", function* ({ payload }) {
    try {
      const { plip } = payload;

      yield put(isSigningPlip(true));

      const user = yield call(fetchProfile, { mobileApi });

      if (!user) return yield put(navigate("signUp"));

      // Check profile completion
      const { key: screenKey } = yield call(profileScreenForCurrentUser);

      if (screenKey !== "showPlip") return yield put(navigate(screenKey, { type: "reset" }));

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
      } catch (e) {
        logError(e);
        if (isDev) console.log("is wallet invalid?", apiError.isInvalidWallet(e), e.errorCode, e);

        if (apiError.isInvalidWallet(e)) return yield call(invalidateWalletAndNavigate, { alertRevalidate: true });

        throw e;
      }
    } catch(e) {
      logError(e);
      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(plipSignError(e));
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
  yield spawn(fetchPlips, { mobileApi, mudamosWebApi });
  yield spawn(signPlip, { mobileApi, walletStore, apiError });
  yield spawn(fetchPlipSignInfoSaga, { mobileApi });
}
