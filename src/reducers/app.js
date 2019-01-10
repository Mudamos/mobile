const initialState = {
  mainInitiated: false,
  appLoadingTotal: 5,
  appLoading: 0,
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
    case "INCREASE_APP_LOADING": {
      return {
        ...state,
        appLoading: state.appLoading + 1,
      }
    }
    default:
      return state;
  }
}
