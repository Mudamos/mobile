import { takeLatest } from "redux-saga";
import { call, fork, put } from "redux-saga/effects";

import {
  logError,
} from "../utils";

import {
  remoteLinksFetched,
} from "../actions";

const REMOTE_LINK_NAMES = [
  "link_get_to_know_mudamos",
  "link_help",
  "link_send_your_idea",
  "link_why_projects",
];

function* fetchLinks({ RemoteConfigService }) {
  yield takeLatest("REMOTE_CONFIG_FETCH_LINKS", function* () {
    try {
      const [
        getToKnowMudamos,
        help,
        sendYourIdea,
        whyProjectsLink,
      ] = yield REMOTE_LINK_NAMES.map(name => call(RemoteConfigService.asString, name));

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

export default function* remoteConfigSaga({ RemoteConfigService }) {
  yield fork(fetchLinks, { RemoteConfigService });
}
