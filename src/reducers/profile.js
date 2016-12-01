const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PROFILE_SAVING":
      return { ...state, isSaving: payload.isSaving, errors: null };
    case "PROFILE_USER_UPDATED":
      return {
        ...state,
        currentUser: payload.currentUser,
        isProfileComplete: payload.isProfileComplete,
      };
    case "PROFILE_USER_SAVE_FAILURE":
      return { ...state, errors: payload.error.validations };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        currentUser: null,
        isProfileComplete: false,
        isSaving: false,
        errors: null,
      };
    default:
      return state;
  }
};
