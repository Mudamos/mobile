const initialState = {
  handlingAppLinkError: false,
  lastUrlReceived: "",
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "HANDLING_APP_LINK_ERROR":
      return {
        ...state,
        handlingAppLinkError: true,
      }
    case "SET_APP_LINK_URL":
      return {
        ...state,
        lastUrlReceived: payload.url,
        handlingAppLinkError: false,
      }
    case "CLEAR_APP_LINK_ERROR":
      return {
        ...state,
        handlingAppLinkError: false,
      }
    default:
      return state;
  }
};
