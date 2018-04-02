import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  toPairs,
} from "ramda";

import {
  logError,
} from "../utils";

import {
  remoteConfigFetched,
  remoteLinksFetched,
} from "../actions";

const REMOTE_LINK_NAMES = [
  "link_get_to_know_mudamos",
  "link_help",
  "link_send_your_idea",
  "link_why_projects",
];

const OTHER_CONFIGS = {
  authenticated_signers_button_title: "asString",
  ineligible_to_sign_citywide_plip_reason: "asString",
  ineligible_to_sign_statewide_plip_reason: "asString",
};

function* fetchLinks({ RemoteConfigService }) {
  yield takeLatest("REMOTE_CONFIG_FETCH_LINKS", function* () {
    try {
      const [
        getToKnowMudamos,
        help,
        sendYourIdea,
        whyProjectsLink,
      ] = yield all(REMOTE_LINK_NAMES.map(name => call(RemoteConfigService.asString, name)));

      const links = {
        getToKnowMudamos,
        help,
        sendYourIdea,
        whyProjectsLink,
      };

      yield put(remoteLinksFetched(links));
    } catch(e) {
      logError(e, { tag: "fetchLinks" });
    }
  });
}

function* fetchRemoteConfigs({ RemoteConfigService }) {
  yield takeLatest("REMOTE_CONFIG_FETCH_ALL", function* () {
    try {
      const [
        authenticatedSignersButtonTitle,
        ineligibleToSignCitywidePlipReason,
        ineligibleToSignStatewidePlipReason,
      ] = yield all(toPairs(OTHER_CONFIGS).map(([name, type]) => call(RemoteConfigService[type], name)));

      const config = {
        authenticatedSignersButtonTitle,
        ineligibleToSignCitywidePlipReason,
        ineligibleToSignStatewidePlipReason,
      };

      yield put(remoteConfigFetched(config));
    } catch(e) {
      logError(e, { tag: "fetchRemoteConfigs" });
    }
  });
}

export default function* remoteConfigSaga({ RemoteConfigService }) {
  yield fork(fetchLinks, { RemoteConfigService });
  yield fork(fetchRemoteConfigs, { RemoteConfigService });
}
