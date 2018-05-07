import { take, call , put, fork } from "redux-saga/effects";

import { eventChannel, buffers } from "redux-saga";

import {
  addPlip,
  clearPlipInfo,
  navigate,
  setCurrentPlip,
} from "../actions";

import {
  fetchPlipsRelatedInfo,
} from "./plip";

import {
  getCurrentPlip,
} from "../selectors";

const createMessageChannel = ({ mudDynamicLink, buffer = buffers.sliding(1)}) =>
  eventChannel(emitter => mudDynamicLink.subscribe(emitter), buffer);

function* handleAppLink({ mobileApi, mudamosWebApi, mudDynamicLink }) {
  const channel = yield call(createMessageChannel, { mudDynamicLink });

  try {
    while (true) {
      const url = yield take(channel);

      const slugMatches = /\S+\/(\S+)\/plugins\/peticao\/?$/.exec(url);

      if (slugMatches != null) {
        if (getCurrentPlip) {
          yield put(clearPlipInfo());
        }

        yield put(navigate("showPlip"));

        const slug = slugMatches[1];
        const response = yield call(mudamosWebApi.findPlip, { slug });

        yield put(addPlip(response.plip));
        yield call(fetchPlipsRelatedInfo, { mobileApi, plipIds: [response.plip.id] });
        yield put(setCurrentPlip(response.plip));
      }
    }
  } finally {
    channel.close();
    mudDynamicLink.unsubscribe();
  }
}

export default function* appLinkSaga({ mobileApi, mudamosWebApi, mudDynamicLink }) {
  yield fork(handleAppLink, { mobileApi, mudamosWebApi, mudDynamicLink });
}

