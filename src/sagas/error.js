import { takeEvery } from "redux-saga/effects";

import Toast from "react-native-simple-toast";
import { test } from "ramda";

import {
  isBlank,
} from "../utils";

import locale from "../locales/pt-BR";

const validationMessageFor = validations => (validations || []).map(v => v.message).join("\n");

const errorMessageFor = ({ payload, defaultMessage }) => {
  const { error } = (payload || {});
  let message;

  if (!error) {
    return null;
  }

  if (error.type === "validation") {
    message = validationMessageFor(error.validations);
  }

  return message || error.userMessage || defaultMessage || locale.errors.genericError;
}

const defaultErrorHandler = ({ payload, defaultMessage }) => {
  const errorMessage = errorMessageFor({ payload, defaultMessage });

  return !isBlank(errorMessage) ? Toast.show(errorMessage) : null;
}

function appError({ type, payload }) {
  const handleWithPayload = ({ defaultMessage } = {}) =>
    defaultErrorHandler({ payload, defaultMessage });

  switch (type) {
    case "APPLE_SIGN_IN_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.appleSignInError });
    case "WALLET_CREATE_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.walletCreationError });
    case "FACEBOOK_LOGIN_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.facebookLoginError });
    case "LINKING_OPEN_URL_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.openURLError });
    case "LOCATION_FETCH_LOCATION_ERROR":
    case "ADDRESS_REVERSE_ZIP_CODE_SEARCH_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.locationError });
    case "PASSWORD_RETRIEVE_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.passwordRetrieveError });
    case "PLIP_SIGN_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.signPlipError });
    case "PROFILE_VALIDATE_COMPLETED": {
      return payload.error ? handleWithPayload({ defaultMessage: locale.errors.genericError }) : null;
    }
    case "PLIP_FETCH_SIGNERS_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.genericError });
    case "FETCHING_PLIPS_NEXT_PAGE_ERROR":
    case "PLIPS_REFRESH_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.fetchPlips });
    case "PROFILE_SAVE_AVATAR_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.saveAvatar });
    case "SHARE_LINK_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.shareLinkError });
    case "PLIPS_BY_USER_LOCATION_ERROR": {
      return handleWithPayload();
    }
    case "VOTE_CONFIRMATION_SEND_PHONE_ERROR": {
      return handleWithPayload({ defaultMessage: locale.errors.sendVoteConfirmationError });
    }
    default:
      return test(/.+_(ERROR|FAILURE)$/i, type) ? handleWithPayload() : null;
  }
}

export default function* errorSaga() {
  yield takeEvery("*", appError);
}
