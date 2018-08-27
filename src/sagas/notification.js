import OneSignal from "react-native-onesignal";

import {
  delay,
} from "redux-saga";

import {
  all,
  call,
  fork,
  put,
  select,
  takeLatest,
} from "redux-saga/effects";

import {
  concat,
  flip,
  fromPairs,
  map,
  pick,
  pipe,
  prop,
  zipObj,
} from "ramda";

import {
  oneSignalUserInfoUpdated,
} from "../actions";

import {
  currentAuthToken,
  listAllPlips,
  oneSignalUserInfo,
} from "../selectors";

import {
  different,
  logError,
} from "../utils";

const getUserTags = pipe(pick(["city", "uf"]), map(v => v || "-"));

const signedPlipTag = pipe(String, concat("signed-plip-"));

function* updateOneSignalProfile() {
  yield takeLatest("PROFILE_USER_UPDATED", function* ({ payload: { currentUser } }) {
    try {
      if (!currentUser) return;
      const info = yield select(oneSignalUserInfo);

      const newAttrs = {
        email: currentUser.email,
        uf: currentUser.address.uf ? currentUser.address.uf.toLowerCase() : null,
        city: currentUser.address.city,
      };

      if (different(info, newAttrs)) {
        yield all([
          call([OneSignal, OneSignal.sendTags], getUserTags(newAttrs)),
          call([OneSignal, OneSignal.syncHashedEmail], newAttrs.email),
        ]);

        yield put(oneSignalUserInfoUpdated(newAttrs));
      }
    } catch(e) {
      logError(e, { tag: "updateOneSignal" });
    }
  });
}

function* signedPlips({ mobileApi }) {
  yield takeLatest("PLIP_USER_SIGN_INFO", function* () {
    try {
      yield call(delay, 3000);

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.listSignPlipsByUser, authToken);
      const plips = response.petitions;

      const plipsId = plips.map(plip => plip.idPetition);
      const plipshasVoted = plips.map(plip => plip.hasVoted ? true : false);

      const plipsTags = plipsId.map(signedPlipTag);
      const plipshasVotedToS = plipshasVoted.map(String);

      const tags = zipObj(plipsTags, plipshasVotedToS);

      yield call([OneSignal, OneSignal.sendTags], tags);
    } catch(e) {
      logError(e, { tag: "signedPlips" });
    }
  })
}

function* clearOneSinalProfileInfo() {
  yield takeLatest("SESSION_USER_LOGGED_OUT", function* () {
    try {
      const newAttrs = {
        email: "",
        uf: "",
        city: "",
      };

      yield all([
        call([OneSignal, OneSignal.sendTags], getUserTags(newAttrs)),
        call([OneSignal, OneSignal.syncHashedEmail], newAttrs.email),
      ]);
    } catch(e) {
      logError(e, { tag: "clearOneSinalProfileInfo" });
    }
  });
}

function* clearSignedPlips() {
  yield takeLatest("SESSION_USER_LOGGED_OUT", function* () {
    try {
      const plips = yield select(listAllPlips);
      const tags = pipe(
        map(prop("detailId")),
        map(signedPlipTag),
        map(tag => [tag, "false"]),
        fromPairs
      )(plips);

      yield call([OneSignal, OneSignal.sendTags], tags);
    } catch(e) {
      logError(e, { tag: "clearSignedPlips" });
    }
  });
}

export default function* notificationSaga({ mobileApi }) {
  yield fork(updateOneSignalProfile);
  yield fork(clearOneSinalProfileInfo);
  yield fork(signedPlips, { mobileApi });
  yield fork(clearSignedPlips);
}
