const initialState = {
  isSigningUp: false,
  tseVoteAddress: null,
  voteCardId: null,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "PROFILE_CLEAR_VOTE_ADDRESS_DATA":
      return { ...state, tseVoteAddress: null };
    case "PROFILE_FETCHING":
      return { ...state, isFetching: payload.isFetching };
    case "PROFILE_FETCHING_ERROR":
      return { ...state, profileFetchError: payload.profileFetchError };
    case "PROFILE_SAVING":
      return {
        ...state,
        isSaving: payload.isSaving,
        errors: null,
        hasError: false,
      };
    case "SIGNING_UP":
      return { ...state, isSigningUp: payload.isSigningUp };
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
      return {
        ...state,
        errors: payload.error.validations,
        hasError: !!payload.error,
      };
    case "PROFILE_CLEAR_SAVE_ERRORS":
      return { ...state, errors: null, hasError: false };
    case "PROFILE_VOTE_CARD_ID_ACQUIRED": {
      const { voteCardId } = payload;
      return { ...state, voteCardId };
    }
    case "PROFILE_TSE_VOTE_ADDRESS_ACQUIRED": {
      const { tseVoteAddress } = payload;
      return { ...state, tseVoteAddress };
    }
    case "PROFILE_RESET_VOTE_CARD_ID_AND_TSE_ADDRESS": {
      return { ...state, tseVoteAddress: null, voteCardId: null };
    }
    case "PROFILE_SAVING_AVATAR":
      return { ...state, isSavingAvatar: payload.isSaving, avatarError: null };
    case "PROFILE_SAVE_AVATAR_ERROR":
      return { ...state, avatarError: payload.error };
    case "PROFILE_VALIDATE_PROFILE": {
      return { ...state, validatingProfile: true };
    }
    case "PROFILE_VALIDATE_COMPLETED": {
      return { ...state, validatingProfile: false };
    }
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        avatarError: null,
        currentUser: null,
        isFetching: false,
        isSaving: false,
        errors: null,
        hasError: false,
        isSendingPhoneValidation: false,
        isSigningUp: false,
        phoneJustValidated: false,
        profileFetchError: false,
        sendValidationErrors: null,
        tseVoteAddress: null,
        validatingProfile: false,
        voteCardId: null,
      };
    default:
      return state;
  }
};
