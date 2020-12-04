import { call, fork, put, select, take, takeLatest } from "redux-saga/effects";

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
  findPlipByPath,
  getAppLinkUrl,
  handlingAppLinkError,
} from "../selectors";

import { logError } from "../utils";

import { head } from "ramda";

const createMessageChannel = ({
  mudDynamicLink,
  buffer = buffers.sliding(1),
}) => eventChannel((emitter) => mudDynamicLink.subscribe(emitter), buffer);

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

function* handlePlip({ mobileApi }) {
  yield takeLatest("HANDLE_APP_LINK", function* () {
    const url = yield select(getAppLinkUrl);

    const pathMatches = /\S+(\/temas\/\S+\/plugins\/peticao)\/?$/.exec(url);

    if (pathMatches != null) {
      try {
        yield put(navigate("showPlip"));

        const path = pathMatches[1];
        const foundPlip = yield select(findPlipByPath(path));

        if (foundPlip) {
          yield put(setCurrentPlip(foundPlip));
        } else {
          const response = yield call(mobileApi.listPlips, {
            includeCauses: true,
            limit: 1,
            page: 0,
            scope: "all",
            path,
          });
          const plip = head(response.plips);
          yield put(setCurrentPlip(plip));
        }
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

export default function* appLinkSaga({ mobileApi, mudDynamicLink }) {
  yield fork(receiveAppLink, { mudDynamicLink });
  yield fork(handlePlip, { mobileApi });
  yield fork(clearError);
}
