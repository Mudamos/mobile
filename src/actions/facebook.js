export const facebookUserLogIn = () => ({
  type: "FACEBOOK_USER_LOG_IN",
});

export const facebookUserLoggedIn = (data) => ({
  type: "FACEBOOK_USER_LOGGED_IN",
  payload: { data },
});

export const facebookLogInError = (error) => ({
  type: "FACEBOOK_LOGIN_ERROR",
  payload: { error },
});
