import { Alert } from "react-native";
import { call, fork, put, select, takeLatest } from "redux-saga/effects";

import {
  navigate,
  sendVotePhoneConfirmationError,
  sendVotePhoneConfirmationSuccess,
  sendVoteCodeConfirmationSuccess,
  sendVoteCodeConfirmationError,
  voteCodeConfirmationDismiss,
  unauthorized,
} from "../actions";

import locale from "../locales/pt-BR";
import { currentAuthToken } from "../selectors";
import { SCREEN_KEYS, SCREEN_NAVIGATION_TYPES } from "../models";
import { isUnauthorized, log, logError } from "../utils";

function* sendVoteConfirmation({ mobileApi }) {
  yield takeLatest("VOTE_CONFIRMATION_SEND_PHONE", function* ({ payload: { goBackToScreenKey, phone, plip } }) {
    try {
      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.sendVoteConfirmation, authToken, { phone, plipId: plip.id });

      log(response);

      yield put(sendVotePhoneConfirmationSuccess());
      yield put(navigate(SCREEN_KEYS.CONFIRM_VOTE_CODE, { goBackToScreenKey, phone, plip }));
    } catch (e) {
      logError(e, { tag: "sendVoteConfirmation" });

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(sendVotePhoneConfirmationError(e));
    }
  });
}

function* sendVoteCodeConfirmation({ dispatch, mobileApi }) {
  yield takeLatest("VOTE_CONFIRMATION_SEND_CODE", function* ({ payload: { goBackToScreenKey, phone, pinCode, plip } }) {
    try {
      const authToken = yield select(currentAuthToken);
      yield call(mobileApi.sendVoteCodeConfirmation, authToken, { phone, pinCode, plipId: plip.id });

      yield put(sendVoteCodeConfirmationSuccess());

      Alert.alert(
        locale.confirmed,
        locale.voteCodeConfirmed,
        [{
          text: locale.ok,
          onPress: () => dispatch(voteCodeConfirmationDismiss({ goBackToScreenKey })),
        }]
      );
    } catch (e) {
      logError(e, { tag: "sendVoteCodeConfirmation" });

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(sendVoteCodeConfirmationError(e));
    }
  });
}

function* dismiss() {
  yield takeLatest("VOTE_CONFIRMATION_DISMISS", function* ({ payload: { goBackToScreenKey }}) {
    yield put(navigate(goBackToScreenKey, { type: SCREEN_NAVIGATION_TYPES.pushOrPop }));
  });
}

export default function* voteConfirmationSaga({ dispatch, mobileApi }) {
  yield fork(sendVoteConfirmation, { mobileApi });
  yield fork(sendVoteCodeConfirmation, { dispatch, mobileApi });
  yield fork(dismiss);
}
