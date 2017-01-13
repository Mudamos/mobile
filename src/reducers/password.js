const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PASSWORD_RETRIEVING":
      return {
        ...state,
        isRetrieving: payload.isRetrieving,
      };
    case "PASSWORD_CHANGING_FORGOT":
      return {
        ...state,
        isChangingForgot: payload.isChangingForgot,
        changeForgotErrors: null,
      };
    case "PASSWORD_CHANGE_FORGOT_ERROR":
      return {
        ...state,
        changeForgotErrors: payload.error.validations,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        isRetrieving: false,
        isChangingForgot: false,
        changeForgotErrors: null,
      };
    default:
      return state;
  }
}
