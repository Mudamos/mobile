import { call, fork, put, spawn, select, takeEvery, takeLatest } from "redux-saga/effects";

import { Actions } from "react-native-router-flux";

import { homeSceneKey, isDev } from "../utils";

import { findIndex } from "ramda";

import { logout } from "./session";

import {
  isAddressProfileComplete,
  isFacebookMainProfileComplete,
  isMainProfileComplete,
  isWalletProfileComplete,
  isDetailProfileComplete,
  isSigningUpComplete,
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

function* unauthorized({ mobileApi, sessionStore }) {
  yield takeLatest("NAVIGATE_UNAUTHORIZED", function* ({ payload }) {
    try {
      const { params } = payload;
      yield call(logout, { mobileApi, sessionStore });
      yield put(navigate("signUp", params));
    } catch(e) {
      if (isDev) console.log("Error unauthorized navigation: ", e.message, e.stack, e);
    }
  });
}

function* userProfileNavigator() {
  // Defines a state machine for the user profile screens
  yield takeLatest("USER_PROFILE_NAVIGATOR", function* ({ payload }) {
    try {
      const { params } = payload;

      const { key, ...args } = yield call(profileScreenForCurrentUser);
      const options = { ...args, ...params };

      if (isDev) console.log("Go to profile screen: ", key, options);

      yield put(navigate(key, options));
    } catch (e) {
      if (isDev) console.log("Error while navigating: ", e.message, e.stack, e);
    }
  });
}

export function* profileScreenForCurrentUser() {
  const screenKeys = [
    "signUp",
    "signIn",
    "profileSignUp",
    "profileAddress",
    "profileWallet",
    "profileConclude",
  ];

  const firstScreenNotDone = screensDone => screenKeys[findIndex(s => !s)(screensDone)];
  const screensDone = [
    yield select(isFacebookMainProfileComplete),
    yield select(isMainProfileComplete),
    yield select(isDetailProfileComplete),
    yield select(isAddressProfileComplete),
    yield select(isWalletProfileComplete),
    yield select(isSigningUpComplete),
  ];

  const goToScreen = firstScreenNotDone(screensDone);

  if (goToScreen) return { key: goToScreen };

  return { key: homeSceneKey, type: "reset" };
}

export default function* navigationSaga({ mobileApi, sessionStore }) {
  yield fork(forward);
  yield fork(backward);
  yield spawn(userProfileNavigator);
  yield spawn(unauthorized, { mobileApi, sessionStore });
}
