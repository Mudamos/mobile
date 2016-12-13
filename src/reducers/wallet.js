const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "WALLET_CREATING":
      return {
        ...state,
        isCreating: payload.isCreating,
        error: false,
      };
    case "WALLET_CREATE_ERROR":
      return {
        ...state,
        error: true,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        isCreating: false,
        error: false,
      };
    default:
      return state;
  }
}
