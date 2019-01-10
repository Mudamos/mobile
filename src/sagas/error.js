import { takeEvery } from "redux-saga/effects";

import Toast from "react-native-simple-toast";

import locale from "../locales/pt-BR";


const showToast = message => Toast.show(message);

const validationMessageFor = validations => (validations || []).map(v => v.message).join("\n");

const errorMessageFor = ({ payload, defaultMessage }) => {
  const { error } = (payload || {});
  let message;

  if (error.type === "validation") {
    message = validationMessageFor(error.validations);
  }

  return message || error.userMessage || defaultMessage || locale.errors.genericError;
}

const defaultErrorHandler = ({ payload, defaultMessage }) =>
  Toast.show(
    errorMessageFor({
      payload,
      defaultMessage,
    })
  )

function appError({ type, payload }) {
  const handleWithPayload = ({ defaultMessage } = {}) =>
    defaultErrorHandler({ payload, defaultMessage });

  switch (type) {
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
    case "PASSWORD_CHANGE_FORGOT_ERROR":
    case "PROFILE_SENDING_PHONE_VALIDATION_ERROR":
    case "ADDRESS_ZIP_CODE_SEARCH_ERROR":
      return handleWithPayload();
  }
}

export default function* errorSaga() {
  yield takeEvery("*", appError);
}
