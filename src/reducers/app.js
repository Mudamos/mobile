const initialState = {
  setupInitiated: false,
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
    case "APP_SETUP_INITIATED": {
      return {
        ...state,
        setupInitiated: true,
      };
    }
    default:
      return state;
  }
}
