const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "APP_READY":
      return {
        ...state,
        isReady: payload.isReady,
      };
    default:
      return state;
  }
}
