const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "PASSWORD_RETRIEVING":
      return {
        ...state,
        isRetrieving: payload.isRetrieving,
      };
    case "PASSWORD_CHANGING":
      return {
        ...state,
        isChanging: payload.isChanging,
        changeErrors: null,
      };
    case "PASSWORD_CHANGING_FORGOT":
      return {
        ...state,
        isChangingForgot: payload.isChangingForgot,
        changeForgotErrors: null,
      };
    case "PASSWORD_CHANGE_ERROR":
      return {
        ...state,
        changeErrors: payload.error.validations,
      };
    case "PASSWORD_CLEAR_CHANGE_ERROR":
      return {
        ...state,
        changeErrors: null,
      };
    case "PASSWORD_CHANGE_FORGOT_ERROR":
      return {
        ...state,
        changeForgotErrors: payload.error.validations,
      };
    case "PASSWORD_CLEAR_CHANGE_FORGOT_ERROR":
      return {
        ...state,
        changeForgotErrors: null,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        isRetrieving: false,
        isChanging: false,
        isChangingForgot: false,
        changeErrors: null,
        changeForgotErrors: null,
      };
    default:
      return state;
  }
};
