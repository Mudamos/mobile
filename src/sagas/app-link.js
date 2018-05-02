import { take, call , put, fork, select } from "redux-saga/effects";

import { eventChannel, buffers } from "redux-saga";

import {
  navigate,
  appReady,
  fetchingPlipRelatedInfo,
} from "../actions";

import {
  fetchPlip,
} from "./plip"


const createMessageChannel = ({ mudDynamicLink, buffer = buffers.sliding(1)}) =>
  eventChannel(emitter => mudDynamicLink.subscribe(emitter), buffer);

function* handleAppLink({ mudamosWebApi, mudDynamicLink }) {
  const channel = yield call(createMessageChannel, { mudDynamicLink });

  try {
    while(true) {
      const url = yield take(channel);

      let slug = /\S+\/(\S+)\/plugins\/peticao$/.exec(url);

      if(slug != null) {
        const state = yield select();
        yield call(showLoading, { state, boolean: true});

        slug = slug[1];
        const response = yield call(mudamosWebApi.findPlip, { slug });
        yield call(fetchPlip, { plip: response.plip });

        yield call(showLoading, { state, boolean: false});

        yield put(navigate("showPlip", { plip: response.plip }));
      }
    }
  } finally {
    channel.close();
    mudDynamicLink.unsubscribe();
  }
}

function* showLoading({ state, boolean}) {
  if(state.navigation.currentKey == "showPlip") {
    yield put(fetchingPlipRelatedInfo(boolean));
  } else {
    yield put(appReady(!boolean));
  }
}

export default function* appLinkSaga({ mudamosWebApi, mudDynamicLink }) {
  yield fork(handleAppLink, { mudamosWebApi, mudDynamicLink });
}

