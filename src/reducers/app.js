const initialState = {
  mainInitiated: false,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "APP_READY":
      return {
        ...state,
        isReady: payload.isReady,
      };
    case "APP_MAIN_INITIATED": {
      return {
        ...state,
        mainInitiated: true,
      };
    }
    default:
      return state;
  }
}
