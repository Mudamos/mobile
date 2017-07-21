const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "FACEBOOK_USER_LOGGED_IN":
      return {
        ...state,
        data: payload.data,
      };
    case "FACEBOOK_LOGIN_ERROR":
      return { ...state, data: null };
    case "SESSION_CLEAR_SESSION":
      return { ...state, data: null };
    default:
      return state;
  }
}
