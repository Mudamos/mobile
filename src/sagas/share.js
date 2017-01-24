import { takeEvery } from "redux-saga";
import { call, put, spawn } from "redux-saga/effects";

import {
  shareLinkError,
} from "../actions";

import { hashtagfy, logError } from "../utils";
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

      if (e.error !== SHARE_CANCEL_ERROR_MESSAGE) {
        yield put(shareLinkError(e));
      }
    }
  })
}

function* sharePlip() {
  yield takeEvery("SHARE_PLIP", function* ({ payload }) {
    try {
      const { plip } = payload;

      const shareOptions = {
        url: plip.plipUrl,
        subject: plip.callToAction,
        message: locale.shareMessage({
          description: plip.phase.description,
          name: plip.phase.name,
          hashtag: hashtagfy("Mudamos", plip.phase.name),
        }),
      };

      yield call(shareLink, shareOptions);
    } catch (e) {
      logError(e);

      if (e.error !== SHARE_CANCEL_ERROR_MESSAGE) {
        yield put(shareLinkError(e));
      }
    }
  });
}


export default function* shareSaga() {
  yield spawn(shareLinkSaga);
  yield spawn(sharePlip);
}
