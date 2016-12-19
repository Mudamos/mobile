const initialState = {
  userSignInfo: {},
};

export default  (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PLIP_SET_CURRENT_PLIP":
      return { ...state, currentPlip: payload.currentPlip };
    case "PLIPS_FETCHED":
      return {
        ...state,
        plips: payload.plips,
      };
    case "PLIPS_FETCHING":
      return {
        ...state,
        isFetchingPlips: payload.isFetching,
        errorFetchingPlips: false,
    };
    case "PLIP_SIGNING":
      return {
        ...state,
        isSigning: payload.isSigning,
      };
    case "PLIP_USER_SIGN_INFO":
      return {
        ...state,
        userSignInfo: {
          ...state.userSignInfo,
          [payload.plipId]: payload.info,
        },
      };
    case "PLIP_SIGN_INFO_FETCHED":
      return {
        ...state,
        plipSignInfo: payload.info,
      };
    case "PLIP_FETCHING_USER_SIGN_INFO":
      return {
        ...state,
        isFetchingUserSignInfo: payload.isFetchingUserSignInfo,
      };
    case "PLIP_FETCHING_PLIP_SIGN_INFO":
      return {
        ...state,
        isFetchingPlipSignInfo: payload.isFetchingPlipSignInfo,
      };
    case "ERROR_FETCHING_PLIPS":
      return {
        ...state,
        errorFetchingPlips: true,
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
