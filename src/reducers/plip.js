const initialState = {};

export default  (state = initialState, action) => {
  const { type, payload } = action;

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
    case "ERROR_FETCHING_PLIPS":
      return {
        ...state,
        errorFetchingPlips: payload.error.json,
        isFetchingPlips: false,
      };
    default:
      return state;
  }
};
