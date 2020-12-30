const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "AUTHENTICATION_LOGIN_ERROR":
      return {
        ...state,
        authLoginError: payload.error.errorCode || "defaultLoginError",
      };
    case "CLEAR_AUTHENTICATION_LOGIN_ERROR":
      return {
        ...state,
        authLoginError: null,
      };
    case "SESSION_LOGGING_IN":
      return {
        ...state,
        isLoggingIn: true,
        authLoginError: null,
      };
    case "SESSION_LOGGIN_SUCCEEDED":
      return {
        ...state,
        token: payload.token,
        isLoggingIn: false,
      };
    case "SESSION_LOGGING_IN_FINISHED":
      return {
        ...state,
        isLoggingIn: false,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        isLoggingIn: false,
        token: null,
      };
    default:
      return state;
  }
};
