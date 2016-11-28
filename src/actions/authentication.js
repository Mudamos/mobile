export const logInError = error => ({
  type: "AUTHENTICATION_LOGIN_ERROR",
  payload: { error },
});
