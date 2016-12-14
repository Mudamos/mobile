const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
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
      }
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
}
