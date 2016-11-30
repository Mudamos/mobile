import { takeEvery, takeLatest } from "redux-saga";
import { call, fork, put, spawn, select } from "redux-saga/effects";

import { Actions } from "react-native-router-flux";

import { isDev } from "../utils";

import { findIndex } from "ramda";

import {
  currentUser,
  isProfileComplete,
  isMainProfileComplete,
  isBirthProfileComplete,
} from "../selectors";

import { navigate } from "../actions";


function* forward() {
  yield takeEvery("NAVIGATE", function* ({ payload }) {
    const { route, params } = payload;

    try {
      yield call(Actions[route], params);
    } catch(e) {
      console.log(e);
    }
  });
}

function* backward() {
  yield takeEvery("NAVIGATE_BACK", function* () {
    yield call(Actions.pop);
  });
}

function* userProfileNavigator() {
  const screenKeys = [
    "signUp",
    "profileBirth",
  ];

  const firstScreenNotDone = screensDone => screenKeys[findIndex(s => !s)(screensDone)];

  // Defines a state machine for the user profile screens
  yield takeLatest("USER_PROFILE_NAVIGATOR", function* () {
    try {
      if (yield select(isProfileComplete)) {
        yield put(navigate("showPlip", { type: "reset" }));
      } else {
        const screensDone = [
          yield select(isMainProfileComplete),
          yield select(isBirthProfileComplete),
        ];

        const goToScreen = firstScreenNotDone(screensDone);
        if (isDev) console.log("Go to profile screen: ", goToScreen);

        yield put(navigate(goToScreen));
      }
    } catch (e) {
      if (isDev) console.log("Error while navigating: ", e.message, e.stack, e);
    }
  });
}

export default function* navigationSaga() {
  yield fork(forward);
  yield fork(backward);
  yield spawn(userProfileNavigator);
}
