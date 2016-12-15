import { takeEvery, takeLatest } from "redux-saga";
import { call, fork, put, spawn, select } from "redux-saga/effects";

import { Actions } from "react-native-router-flux";

import { isDev } from "../utils";

import { findIndex } from "ramda";

import {
  isAddressProfileComplete,
  isDocumentsProfileComplete,
  isProfileComplete,
  isMainProfileComplete,
  isBirthProfileComplete,
  isPhoneProfileComplete,
  isWalletProfileComplete,
} from "../selectors";

import { navigate } from "../actions";


function* forward() {
  yield takeEvery("NAVIGATE", function* ({ payload }) {
    const { route, params } = payload;

    if (isDev) console.log("Will navigate with: ", route, params);

    try {
      yield call(Actions[route], params);
    } catch(e) {
      if (isDev) console.log(e);
    }
  });
}

function* backward() {
  yield takeEvery("NAVIGATE_BACK", function* () {
    yield call(Actions.pop);
  });
}

function* userProfileNavigator() {
  // Defines a state machine for the user profile screens
  yield takeLatest("USER_PROFILE_NAVIGATOR", function* () {
    try {
      const { key, ...args } = yield call(profileScreenForCurrentUser);
      if (isDev) console.log("Go to profile screen: ", key);

      yield put(navigate(key, args));
    } catch (e) {
      if (isDev) console.log("Error while navigating: ", e.message, e.stack, e);
    }
  });
}

export function* profileScreenForCurrentUser() {
  const screenKeys = [
    "signUp",
    "profileBirth",
    "profileAddress",
    "profileDocuments",
    "profilePhone",
    "profileWallet",
  ];

  const firstScreenNotDone = screensDone => screenKeys[findIndex(s => !s)(screensDone)];
  const showPlipKey = "showPlip";

  if (yield select(isProfileComplete)) {
    return { key: showPlipKey, type: "reset" };
  } else {
    const screensDone = [
      yield select(isMainProfileComplete),
      yield select(isBirthProfileComplete),
      yield select(isAddressProfileComplete),
      yield select(isDocumentsProfileComplete),
      yield select(isPhoneProfileComplete),
      yield select(isWalletProfileComplete),
    ];

    const goToScreen = firstScreenNotDone(screensDone);

    if (goToScreen) return { key: goToScreen };

    // TODO: for now, as we should not reach this.
    return { key: showPlipKey, type: "reset" };
  }
}

export default function* navigationSaga() {
  yield fork(forward);
  yield fork(backward);
  yield spawn(userProfileNavigator);
}
