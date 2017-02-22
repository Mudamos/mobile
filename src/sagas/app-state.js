import { eventChannel, buffers } from "redux-saga";
import { fork, call, put, take, cancel } from "redux-saga/effects";
import { AppState } from "react-native";

import {
  appOnForeground,
  appOnBackground,
} from "../actions";

const createAppStateChannel = (buffer = buffers.sliding(2)) => {
  return eventChannel(emitter => {
    const stateEmitter = (state) => {
      emitter({ state });
    };

    AppState.addEventListener("change", stateEmitter);

    // At our first subscribe the current state won't be called.
    stateEmitter(AppState.currentState);

    return () => {
      AppState.removeEventListener("change", stateEmitter);
    };
  }, buffer);
}

function* listenStateSaga() {
  const appStateChannel = yield call(createAppStateChannel);

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { state } = yield take(appStateChannel);

      if (state == "active") {
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
