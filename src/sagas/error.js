import { takeEvery } from "redux-saga";

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
    case "AUTHENTICATION_LOGIN_ERROR":
      return handleWithPayload({ defaultMessage: locale.errors.loginError });
    case "WALLET_CREATE_ERROR":
      return showToast(locale.errors.walletCreationError);
    case "FACEBOOK_LOGIN_ERROR":
      return showToast(locale.errors.facebookLoginError);
    case "LINKING_OPEN_URL_ERROR":
      return showToast(locale.errors.openURLError);
    case "PROFILE_SENDING_PHONE_VALIDATION_ERROR":
    case "PROFILE_USER_SAVE_FAILURE":
    case "ADDRESS_ZIP_CODE_SEARCH_ERROR":
      return handleWithPayload();
  }
}

export default function* errorSaga() {
  yield takeEvery("*", appError);
}
