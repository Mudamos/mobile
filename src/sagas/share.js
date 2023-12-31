import { call, put, spawn, fork, takeEvery } from "redux-saga/effects";

import { keys } from "ramda";

import { shareLinkError } from "../actions";

import {
  MUDAMOS_APP_SITE,
  hashtagfy,
  log,
  logError,
  randomItem,
} from "../utils";
import locale from "../locales/pt-BR";

import Share from "react-native-share";

const SHARE_CANCEL_ERROR_MESSAGE = "User did not share";

function* shareLink(options) {
  yield call([Share, Share.open], options);
}

function* shareLinkSaga() {
  yield takeEvery("SHARE_LINK", function* ({ payload }) {
    try {
      yield call(shareLink, payload);
    } catch (e) {
      logError(e);

      if (e.message !== SHARE_CANCEL_ERROR_MESSAGE) {
        yield put(shareLinkError(e));
      }
    }
  });
}

function* sharePlip() {
  yield takeEvery("SHARE_PLIP", function* ({ payload }) {
    try {
      const { plip } = payload;

      const shareOptions = {
        url: plip.shareLink ? plip.shareLink : plip.plipUrl,
        subject: plip.callToAction,
        message: locale.shareMessage({
          description: plip.subtitle,
          name: plip.title,
          hashtag: hashtagfy("Mudamos", plip.title),
        }),
      };

      yield call(shareLink, shareOptions);
    } catch (e) {
      logError(e);

      if (e.message !== SHARE_CANCEL_ERROR_MESSAGE) {
        yield put(shareLinkError(e));
      }
    }
  });
}

function* tellAFriend() {
  yield takeEvery("SHARE_TELL_A_FRIEND", function* () {
    try {
      const ids = keys(locale.tellAFriendMessages);
      const randomId = randomItem(ids);
      const url = `${MUDAMOS_APP_SITE}/?${randomId}`;
      const message = locale.tellAFriendMessages[randomId];
      const shareOptions = { url, message };

      log(`Sharing: ${JSON.stringify(shareOptions)}`);
      yield call(shareLink, shareOptions);
    } catch (e) {
      logError(e);

      if (e.message !== SHARE_CANCEL_ERROR_MESSAGE) {
        yield put(shareLinkError(e));
      }
    }
  });
}

export default function* shareSaga() {
  yield spawn(shareLinkSaga);
  yield spawn(sharePlip);
  yield fork(tellAFriend);
}
