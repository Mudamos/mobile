import { all, take, takeLatest, call , put, fork, wait, select } from "redux-saga/effects";

import { eventChannel, END, buffers, delay } from 'redux-saga';

import {
  navigate,
  appReady,
  navigateBack,
  fetchingPlipRelatedInfo,
} from "../actions";

import {
  fetchPlip,
} from "./plip"

import {
  findPlips,
} from "../selectors";

import {
  contains,
  flip,
  pipe,
  prop,
} from "ramda";

const createMessageChannel = ({ mudDynamicLink, buffer = buffers.sliding(1)}) =>
  eventChannel(emitter => mudDynamicLink.subscribe(emitter), buffer);

function* handleAppLink({ mudamosWebApi, mobileApi, mudDynamicLink }) {
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

export default function* appLinkSaga({ mudamosWebApi, mobileApi, mudDynamicLink }) {
  yield fork(handleAppLink, { mudamosWebApi, mobileApi, mudDynamicLink });
}

