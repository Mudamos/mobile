import { takeLatest } from "redux-saga";
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
  fetchingUserSignInfo,
  isSigningPlip,
  navigate,
  plipsFetched,
  plipsFetchError,
  plipSignError,
  plipSignInfoFetched,
  plipUserSignInfo,
  setCurrentPlip,
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
      // For now we can easily to this because of the MVP
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
  ];
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

function* signPlip({ mobileApi, walletStore }) {
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

      const difficulty = yield call(mobileApi.difficulty, authToken);
      const seed = yield call(walletStore.retrieve, user.voteCard);
      const message = buildSignMessage({ user, plip });
      const block = LibCrypto.signMessage(seed, message, difficulty);

      if (isDev) console.log("Block:", block);

      const apiResult = yield call(mobileApi.signPlip, authToken, {
        petitionId: plip.id,
        block,
      });

      if (isDev) console.log("Sign api result:", apiResult);

      yield put(plipUserSignInfo({ plipId: plip.id, info: apiResult.signMessage }));
    } catch(e) {
      logError(e);
      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(plipSignError(e));
    } finally {
      yield put(isSigningPlip(false));
    }
  });
}

export default function* plipSaga({ mobileApi, mudamosWebApi, walletStore }) {
  yield spawn(fetchPlips, { mobileApi, mudamosWebApi });
  yield spawn(signPlip, { mobileApi, walletStore });
}
