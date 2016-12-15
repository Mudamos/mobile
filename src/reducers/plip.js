const initialState = {
  userSignInfo: {},
};

export default  (state = initialState, action) => {
  const { type, payload } = action;
  let userSignInfo;

  if (type === "PLIP_USER_SIGN_INFO") {
    userSignInfo = { ...state.userSignInfo };
    userSignInfo[payload.plipId] = payload.info;
  }

  switch (type) {
    case "PLIPS_FETCHED":
      return {
        ...state,
        plips: payload.plips,
        errorFetchingPlips: null,
        isFetchingPlips: false,
      };
    case "FETCH_PLIPS":
      return {
        ...state,
        errorFetchingPlips: null,
        isFetchingPlips: true,
      };
    case "PLIP_SIGNING":
      return {
        ...state,
        isSigning: payload.isSigning,
      };
    case "PLIP_USER_SIGN_INFO":
      return {
        ...state,
        userSignInfo,
      };
    case "ERROR_FETCHING_PLIPS":
      return {
        ...state,
        errorFetchingPlips: payload.error.json,
        isFetchingPlips: false,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        userSignInfo: {},
      };
    default:
      return state;
  }
};
