import OneSignal from "react-native-onesignal";

import {
  buffers,
  delay,
} from "redux-saga";

import {
  actionChannel,
  all,
  call,
  flush,
  fork,
  put,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";

import {
  concat,
  flip,
  fromPairs,
  lensPath,
  map,
  pick,
  pipe,
  prop,
  view,
  zipObj,
} from "ramda";

import {
  oneSignalUserInfoUpdated,
} from "../actions";

import {
  findPlip,
  listAllPlips,
  hasUserSignedPlip,
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
          call([OneSignal, OneSignal.syncHashedEmail], newAttrs.email || "-"),
        ]);

        yield put(oneSignalUserInfoUpdated(newAttrs));
      }
    } catch(e) {
      logError(e, { tag: "updateOneSignal" });
    }
  });
}

function* signedPlips() {
  const channel = yield actionChannel("PLIP_USER_SIGN_INFO", buffers.expanding(50));

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const currentAction = yield take(channel);

      yield call(delay, 3000);

      const pendingActions = yield flush(channel);
      const actions = [currentAction, ...pendingActions];

      const ids = actions.map(view(lensPath(["payload", "plipId"])));

      const signedResult = yield all(ids.map(id => select(hasUserSignedPlip(id))));
      const plips = yield all(ids.map(id => select(findPlip(id))));
      const detailIds = plips.map(prop("detailId"));

      const buildTags = pipe(
        map(signedPlipTag),
        flip(zipObj)(signedResult.map(String))
      );

      const tags = buildTags(detailIds);

      yield call([OneSignal, OneSignal.sendTags], tags);
    } catch(e) {
      logError(e, { tag: "signedPlips" });
    }
  }
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
        call([OneSignal, OneSignal.syncHashedEmail], newAttrs.email || "-"),
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

export default function* notificationSaga() {
  yield fork(updateOneSignalProfile);
  yield fork(clearOneSinalProfileInfo);
  yield fork(signedPlips);
  yield fork(clearSignedPlips);
}
