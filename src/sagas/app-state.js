import { eventChannel, buffers } from "redux-saga";
import { fork, call, put, take, cancel } from "redux-saga/effects";
import { AppState } from "react-native";

import { contains, flip } from "ramda";

import { backoff } from "../utils";

import { appOnForeground, appOnBackground } from "../actions";

const KNOWN_STATES = ["active", "inactive", "background"];
const isKnownState = flip(contains)(KNOWN_STATES);

const createAppStateChannel = (buffer = buffers.sliding(2)) => {
  return eventChannel((emitter) => {
    const stateEmitter = (state) => {
      emitter({ state });
    };

    AppState.addEventListener("change", stateEmitter);

    // For some reason AppState.currentState returns 'unknown'
    // so we wait until it returns a valid state in order to fire the initial app state
    backoff(
      () =>
        new Promise((resolve, reject) =>
          isKnownState(AppState.currentState)
            ? resolve(stateEmitter(AppState.currentState))
            : reject(),
        ),
    );

    return () => {
      AppState.removeEventListener("change", stateEmitter);
    };
  }, buffer);
};

function* listenStateSaga() {
  const appStateChannel = yield call(createAppStateChannel);

  try {
    while (true) {
      const { state } = yield take(appStateChannel);

      if (state === "active") {
        yield put(appOnForeground());
      } else {
        yield put(appOnBackground());
      }
    }
  } finally {
    appStateChannel.close();
  }
}

export default function* appStateSaga() {
  yield take("APP_DID_MOUNT");
  const listenTask = yield fork(listenStateSaga);
  yield take("APP_WILL_UNMOUNT");
  yield cancel(listenTask);
}
