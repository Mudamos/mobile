import { call , fork, put, select, take, takeLatest } from "redux-saga/effects";

import { buffers, eventChannel } from "redux-saga";

import {
  appLinkHandleError,
  clearAppLinkError,
  handleAppLink,
  navigate,
  setAppLinkUrl,
  setCurrentPlip,
} from "../actions";

import {
  getAppLinkUrl,
  handlingAppLinkError,
} from "../selectors";

import {
  logError,
} from "../utils";

const createMessageChannel = ({ mudDynamicLink, buffer = buffers.sliding(1)}) =>
  eventChannel(emitter => mudDynamicLink.subscribe(emitter), buffer);

function* receiveAppLink({ mudDynamicLink }) {
  const channel = yield call(createMessageChannel, { mudDynamicLink });

  try {
    while (true) {
      const url = yield take(channel);
      yield put(setAppLinkUrl(url));
      yield put(handleAppLink());
    }
  } finally {
    channel.close();
    mudDynamicLink.unsubscribe();
  }
}

function* handlePlip({ mudamosWebApi }) {
  yield takeLatest("HANDLE_APP_LINK", function* () {
    const url = yield select(getAppLinkUrl);

    const slugMatches = /\S+\/(\S+)\/plugins\/peticao\/?$/.exec(url);

    if (slugMatches != null) {
      try {
        yield put(navigate("showPlip"));

        const slug = slugMatches[1];
        const response = yield call(mudamosWebApi.findPlip, { slug });
        yield put(setCurrentPlip(response.plip));
      } catch (e) {
        logError(e);

        yield put(appLinkHandleError(e));
      }
    }
  });
}

// When navigate to other page the appLinkError should disable to don't appear in other pages
function* clearError() {
  yield takeLatest("NAVIGATION", function* () {
    const appLinkError = yield select(handlingAppLinkError);
    if (appLinkError) {
      yield put(clearAppLinkError());
    }
  });
}

export default function* appLinkSaga({ mudamosWebApi, mudDynamicLink }) {
  yield fork(receiveAppLink, { mudDynamicLink });
  yield fork(handlePlip, { mudamosWebApi });
  yield fork(clearError);
}

