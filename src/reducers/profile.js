const initialState = {};


export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PROFILE_FETCHING":
      return { ...state, isFetching: payload.isFetching };
    case "PROFILE_FETCHING_ERROR":
      return { ...state, profileFetchError: payload.profileFetchError };
    case "PROFILE_SAVING":
      return { ...state, isSaving: payload.isSaving, errors: null, hasError: false };
    case "PROFILE_SENDING_PHONE_VALIDATION":
      return {
        ...state,
        isSendingPhoneValidation: payload.isSendingValidation,
        sendValidationErrors: null,
      };
    case "PROFILE_SENDING_PHONE_VALIDATION_ERROR":
      return {
        ...state,
        sendValidationErrors: payload.error.validations,
      };
    case "PROFILE_PHONE_JUST_VALIDATED":
      return {
        ...state,
        phoneJustValidated: payload.validated,
      };
    case "PROFILE_USER_UPDATED":
      return {
        ...state,
        currentUser: payload.currentUser,
      };
    case "PROFILE_USER_SAVE_FAILURE":
      return { ...state, errors: payload.error.validations, hasError: !!payload.error };
    case "PROFILE_CLEAR_SAVE_ERRORS":
      return { ...state, errors: null, hasError: false };
    case "PROFILE_VOTE_CARD_ID_ACQUIRED":
      return { ...state, voteCardId: payload.voteCardId };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        currentUser: null,
        isFetching: false,
        isSaving: false,
        errors: null,
        hasError: false,
        isSendingPhoneValidation: false,
        phoneJustValidated: false,
        profileFetchError: false,
        sendValidationErrors: null,
        voteCardId: null,
      };
    default:
      return state;
  }
};
