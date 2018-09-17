export const isLoggingIn = () => ({
  type: "SESSION_LOGGING_IN",
});

export const finishedLogIn = () => ({
  type: "SESSION_LOGGING_IN_FINISHED",
});

export const logginSucceeded = ({ token }) => ({
  type: "SESSION_LOGGIN_SUCCEEDED",
  payload: { token },
});

export const fetchSession = () => ({
  type: "SESSION_FETCH_SESSION",
});

export const loginUser = (email, password) => ({
  type: "SESSION_LOGIN_USER",
  payload: { email, password },
});

export const logout = () => ({
  type: "SESSION_LOGOUT",
});

export const clearAuthLoginError = () => ({
  type: "CLEAR_AUTHENTICATION_LOGIN_ERROR",
});

export const clearSession = () => ({
  type: "SESSION_CLEAR_SESSION",
});

export const userLoggedOut = () => ({
  type: "SESSION_USER_LOGGED_OUT",
});
