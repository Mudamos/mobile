export const retrievePassword = ({ cpf, email }) => ({
  type: "PASSWORD_RETRIEVE",
  payload: { cpf, email },
});

export const retrievingPassword = (isRetrieving) => ({
  type: "PASSWORD_RETRIEVING",
  payload: { isRetrieving },
});

export const retrievePasswordError = (hasRetrieveError, error) => ({
  type: "PASSWORD_RETRIEVE_ERROR",
  payload: { hasRetrieveError, error },
});

export const changePassword = ({ currentPassword, newPassword }) => ({
  type: "PASSWORD_CHANGE",
  payload: { currentPassword, newPassword },
});

export const changingPassword = (isChanging) => ({
  type: "PASSWORD_CHANGING",
  payload: { isChanging },
});

export const changePasswordError = (error) => ({
  type: "PASSWORD_CHANGE_ERROR",
  payload: { error },
});

export const changeForgotPassword = ({ code, password }) => ({
  type: "PASSWORD_CHANGE_FORGOT",
  payload: { code, password },
});

export const changingForgotPassword = (isChangingForgot) => ({
  type: "PASSWORD_CHANGING_FORGOT",
  payload: { isChangingForgot },
});

export const changeForgotPasswordError = (error) => ({
  type: "PASSWORD_CHANGE_FORGOT_ERROR",
  payload: { error },
});

export const clearChangeForgotPasswordError = () => ({
  type: "PASSWORD_CLEAR_CHANGE_FORGOT_ERROR",
});

export const clearChangePasswordError = () => ({
  type: "PASSWORD_CLEAR_CHANGE_ERROR",
});
