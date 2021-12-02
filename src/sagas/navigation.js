import {
  call,
  fork,
  put,
  spawn,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import { Actions } from "react-native-router-flux";

import { log, logError, homeSceneKey } from "../utils";
import { actionSignerUrl } from "../selectors";
import { SCREEN_KEYS } from "../models";

import { findIndex } from "ramda";

import { logout } from "./session";

import {
  isAddressProfileComplete,
  isDetailProfileComplete,
  isFacebookMainProfileComplete,
  isMainProfileComplete,
  isSigningUpComplete,
  isWalletProfileComplete,
} from "../selectors";

import {
  signingUp,
  navigate,
  actionSignerProceedSignMessageWithUrl,
} from "../actions";

const homeWithReset = { key: homeSceneKey, type: "reset" };

function* forward() {
  yield takeEvery("NAVIGATE", function* ({ payload }) {
    const { route, params } = payload;

    log("Will navigate with: ", { tag: "NAVIGATE" }, route, params);

    try {
      yield call(Actions[route], params);
    } catch (e) {
      logError(e);
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
      yield put(navigate("signIn", params));
    } catch (e) {
      logError(e, { tag: "NAVIGATE_UNAUTHORIZED" });
    }
  });
}

function* userProfileNavigator() {
  // Defines a state machine for the user profile screens
  yield takeLatest("USER_PROFILE_NAVIGATOR", function* ({ payload }) {
    try {
      const { params } = payload;

      const { key, ...args } = yield call(profileScreenForCurrentUser, params);
      const options = { ...args, ...params };

      log(
        "Go to profile screen: ",
        { tag: "USER_PROFILE_NAVIGATOR" },
        key,
        options,
      );

      // When signingUp profile conclude is present to the user
      if (key === SCREEN_KEYS.PROFILE_CONCLUDE) {
        const url = yield select(actionSignerUrl);

        if (url) {
          yield put(signingUp(false));
          yield put(navigate(homeSceneKey, { type: "reset" }));

          log(
            "Will override profile conclude because there is a sign message url",
            { tag: "USER_PROFILE_NAVIGATOR" },
            { url },
          );

          return yield put(actionSignerProceedSignMessageWithUrl({ url }));
        }
      }

      yield put(navigate(key, options));

      const isComplete = key === homeSceneKey;
      if (isComplete) {
        const url = yield select(actionSignerUrl);

        if (url) {
          log(
            "Will proceed sign message because there is a url",
            { tag: "USER_PROFILE_NAVIGATOR" },
            { url },
          );

          yield put(actionSignerProceedSignMessageWithUrl({ url }));
        }
      }
    } catch (e) {
      logError(e, { tag: "USER_PROFILE_NAVIGATOR" });
    }
  });
}

export function* profileScreenForCurrentUser(params = {}) {
  const { revalidateProfileSignPlip } = params;

  const screenKeys = [
    "signUp",
    "signUp",
    "profileSignUp",
    "profileAddress",
    "profileWallet",
    "profileConclude",
  ];

  const firstScreenNotDone = (screensDone) =>
    screenKeys[findIndex((s) => !s)(screensDone)];
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

  if (revalidateProfileSignPlip) return { key: "showPlip" };

  return homeWithReset;
}

export default function* navigationSaga({ mobileApi, sessionStore }) {
  yield fork(forward);
  yield fork(backward);
  yield spawn(userProfileNavigator);
  yield spawn(unauthorized, { mobileApi, sessionStore });
}
