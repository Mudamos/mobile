const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "WALLET_CREATING":
      return {
        ...state,
        isCreating: payload.isCreating,
      };
    default:
      return state;
  }
}
