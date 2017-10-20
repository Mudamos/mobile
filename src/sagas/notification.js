import OneSignal from "react-native-onesignal";

import {
  takeEvery,
} from "redux-saga";

import {
  call,
  fork,
  put,
  select,
} from "redux-saga/effects";

import {
  map,
  pick,
  pipe,
} from "ramda";

import {
  oneSignalUserInfoUpdated,
} from "../actions";

import {
  oneSignalUserInfo,
} from "../selectors";

import {
  different,
  logError,
} from "../utils";

function* updateOneSignalProfile() {
  yield takeEvery("PROFILE_USER_UPDATED", function* ({ payload: { currentUser } }) {
    try {
      if (!currentUser) return;
      const info = yield select(oneSignalUserInfo);

      const newAttrs = {
        email: currentUser.email,
        uf: currentUser.address.uf ? currentUser.address.uf.toLowerCase() : null,
        city: currentUser.address.city,
      };

      const getTags = pipe(pick(["city", "uf"]), map(v => v || ""));

      if (different(info, newAttrs)) {
        yield [
          call([OneSignal, OneSignal.sendTags], getTags(newAttrs)),
          call([OneSignal, OneSignal.syncHashedEmail], newAttrs.email),
        ];

        yield put(oneSignalUserInfoUpdated(newAttrs));
      }
    } catch(e) {
      logError(e, { tag: "updateOneSignal" });
    }
  });
}
export default function* notificationSaga() {
  yield fork(updateOneSignalProfile);
}
