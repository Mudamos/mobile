export const retrievePassword = email => ({
  type: "PASSWORD_RETRIEVE",
  payload: { email },
});

export const retrievingPassword = isRetrieving => ({
  type: "PASSWORD_RETRIEVING",
  payload: { isRetrieving },
});

export const retrievePasswordError = hasRetrieveError => ({
  type: "PASSWORD_RETRIEVE_ERROR",
  payload: { hasRetrieveError },
});

export const changeForgotPassword = ({ code, password }) => ({
  type: "PASSWORD_CHANGE_FORGOT",
  payload: { code, password },
});

export const changingForgotPassword = isChangingForgot => ({
  type: "PASSWORD_CHANGING_FORGOT",
  payload: { isChangingForgot },
});

export const changeForgotPasswordError = error => ({
  type: "PASSWORD_CHANGE_FORGOT_ERROR",
  payload: { error },
});
