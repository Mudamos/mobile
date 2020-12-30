const initialState = {};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "PROFILE_INVALIDATE_PHONE":
      return {
        ...state,
        hasWallet: false,
      };
    case "WALLET_CREATING":
      return {
        ...state,
        isCreating: payload.isCreating,
        hasWallet: false,
        error: false,
      };
    case "WALLET_CREATE_ERROR":
      return {
        ...state,
        error: true,
      };
    case "WALLET_AVAILABLE":
      return {
        ...state,
        hasWallet: payload.hasWallet,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        hasWallet: false,
        isCreating: false,
        error: false,
      };
    default:
      return state;
  }
};
