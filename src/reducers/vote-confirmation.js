const initialState = {
  isSaving: false,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type } = action;

  switch (type) {
    case "VOTE_CONFIRMATION_SEND_PHONE":
    case "VOTE_CONFIRMATION_SEND_CODE": {
      return {
        ...state,
        isSaving: true,
      };
    }
    case "VOTE_CONFIRMATION_SEND_PHONE_SUCCESS":
    case "VOTE_CONFIRMATION_SEND_CODE_SUCCESS": {
      return {
        ...state,
        isSaving: false,
      };
    }
    case "VOTE_CONFIRMATION_SEND_PHONE_ERROR":
    case "VOTE_CONFIRMATION_SEND_CODE_ERROR": {
      return {
        ...state,
        isSaving: false,
      };
    }
    case "VOTE_CONFIRMATION_DISMISS":
    case "SESSION_CLEAR_SESSION":
    default:
      return state;
  }
};
