import { call, fork, put, select, take, takeLatest } from "redux-saga/effects";

import { buffers, eventChannel } from "redux-saga";
import { URL } from "react-native-url-polyfill";

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
  isUserFirstTime,
  isAppReady,
} from "../selectors";

import { signMessageWithUrl } from "./action-signer";

import { isBlank, isNotNil, log, logError, isDev } from "../utils";

import { head } from "ramda";
import Toast from "react-native-simple-toast";

const SIGN_MESSAGE_PATH = "/signlink";
const isSignMessage = (url) => url.pathname === "/signlink";

const createMessageChannel = ({
  mudDynamicLink,
  buffer = buffers.sliding(1),
}) => eventChannel((emitter) => mudDynamicLink.subscribe(emitter), buffer);

function* receiveAppLink({ mudDynamicLink }) {
  const channel = yield call(createMessageChannel, { mudDynamicLink });

  try {
    while (true) {
      const url = yield take(channel);
      log(`message app link on channel: ${url}`);

      if (isBlank(url)) {
        return;
      }

      yield put(setAppLinkUrl(url));
      const appReady = yield select(isAppReady);
      const userFirstTime = yield select(isUserFirstTime);

      // Only handle if loading screen is ready, the loading screen will fire
      // a handleAppLink if there is one available.
      const isNotFirstTime = isNotNil(userFirstTime) && !userFirstTime;
      log(
        "on receiveAppLink",
        { tag: "receiveAppLink" },
        { isNotFirstTime, appReady },
      );
      if (appReady && isNotFirstTime) {
        yield put(handleAppLink());
      }
    }
  } finally {
    channel.close();
    mudDynamicLink.unsubscribe();
  }
}

function* handlePlip({ mobileApi }) {
  yield takeLatest("HANDLE_APP_LINK", function* () {
    const url = yield select(getAppLinkUrl);

    if (isBlank(url)) {
      return;
    }

    const pathMatchesPlip = /\S+(\/temas\/\S+\/plugins\/peticao)\/?$/.exec(url);

    if (pathMatchesPlip != null) {
      try {
        yield put(navigate("showPlip"));

        const path = pathMatchesPlip[1];
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

function* handleSignMessageLink({ mobileApi, walletStore }) {
  yield takeLatest("HANDLE_APP_LINK", function* () {
    const url = yield select(getAppLinkUrl);

    log(`app link: ${url}`, { tag: "handleSignMessageLink" });

    if (isDev) {
      Toast.show(`APP LINK: ${url}`);
    }

    if (isBlank(url)) {
      return;
    }

    try {
      const linkedUrl = new URL(url);
      log(`Parsed linked url: ${linkedUrl}`, { tag: "handleSignMessageLink" });

      if (isSignMessage(linkedUrl)) {
        yield call(signMessageWithUrl, {
          url: linkedUrl,
          mobileApi,
          walletStore,
        });
        return;
      }
    } catch (e) {
      logError(e);
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

export default function* appLinkSaga({
  mobileApi,
  mudDynamicLink,
  walletStore,
}) {
  yield fork(receiveAppLink, { mudDynamicLink });
  yield fork(handlePlip, { mobileApi });
  yield fork(handleSignMessageLink, { mobileApi, walletStore });
  yield fork(clearError);
}
