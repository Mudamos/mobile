const initialState = {};


export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PROFILE_FETCHING":
      return { ...state, isFetching: payload.isFetching };
    case "PROFILE_FETCHING_ERROR":
      return { ...state, profileFetchError: payload.profileFetchError };
    case "PROFILE_SAVING":
      return { ...state, isSaving: payload.isSaving, errors: null };
    case "PROFILE_SENDING_PHONE_VALIDATION":
      return {
        ...state,
        isSendingPhoneValidation: payload.isSendingValidation,
        hasSentPhoneValidation: false,
        sendValidationErrors: null,
      };
    case "PROFILE_SENDING_PHONE_VALIDATION_ERROR":
      return {
        ...state,
        sendValidationErrors: payload.error.validations,
      };
    case "PROFILE_PHONE_VALIDATION_SENT":
      return {
        ...state,
        hasSentPhoneValidation: payload.hasSent,
      };
    case "PROFILE_USER_UPDATED":
      return {
        ...state,
        currentUser: payload.currentUser,
      };
    case "PROFILE_USER_SAVE_FAILURE":
      return { ...state, errors: payload.error.validations };
    case "PROFILE_CLEAR_SAVE_ERRORS":
      return { ...state, errors: null };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        currentUser: null,
        isFetching: false,
        isSaving: false,
        errors: null,
        isSendingPhoneValidation: false,
        hasSentPhoneValidation: false,
        profileFetchError: false,
        sendValidationErrors: null,
      };
    default:
      return state;
  }
};
