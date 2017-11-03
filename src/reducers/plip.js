const initialState = {
  userSignInfo: {},
  justSignedPlips: {},
  plipsSignInfo: {},
  errorFetchingPlips: false,
  isFetchingPlips: false,
  isRefreshingPlips: false,
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type, payload } = action;

  switch (type) {
    case "PLIPS_FETCHING": {
      return {
        ...state,
        isFetchingPlips: payload.isFetching,
        errorFetchingPlips: false,
      };
    }
    case "ERROR_FETCHING_PLIPS":
      return {
        ...state,
        errorFetchingPlips: true,
      };
    case "PLIPS_FETCHED":
      return {
        ...state,
        plips: payload.plips,
        currentPlipsPage: payload.page,
        nextPlipsPage: payload.nextPage,
      };
    case "PLIPS_REFRESHING_PLIPS":
      return {
        ...state,
        isRefreshingPlips: payload.isRefreshing,
      };
    case "PLIP_SIGNING":
      return {
        ...state,
        isSigning: payload.isSigning,
      };
    case "PLIP_JUST_SIGNED":
      return {
        ...state,
        justSignedPlips: {
          ...state.justSignedPlips,
          [payload.plipId]: true,
        },
      };
    case "PLIP_REMOVE_JUST_SIGNED":
      return {
        ...state,
        justSignedPlips: {
          ...state.justSignedPlips,
          [payload.plipId]: false,
        },
      };
    case "PLIP_FETCHING_SIGNERS":
      return {
        ...state,
        isFetchingSigners: payload.isFetching,
        signersFetchError: false,
      };
    case "PLIP_SIGNERS":
      return {
        ...state,
        signers: payload.signers,
      };
    case "PLIP_FETCH_SIGNERS_ERROR":
      return {
        ...state,
        signersFetchError: true,
      };
    case "PLIP_CLEAR_SIGNERS":
      return {
        ...state,
        signers: null,
      };
    case "PLIP_CLEAR_SIGNERS_ERROR":
      return {
        ...state,
        signersFetchError: false,
      };
    case "PLIP_SHORT_SIGNERS":
      return {
        ...state,
        shortSigners: payload.users,
        shortSignersTotal: payload.total,
      };
    case "PLIP_USER_SIGN_INFO":
      return {
        ...state,
        userSignInfo: {
          ...state.userSignInfo,
          [payload.plipId]: payload.info,
        },
      };
    case "PLIP_FETCHING_USER_SIGN_INFO":
      return {
        ...state,
        isFetchingUserSignInfo: payload.isFetchingUserSignInfo,
      };
    case "PLIP_SIGNING_PLIP":
      return {
        ...state,
        currentSigningPlip: payload.plip,
      };
    case "PLIP_FETCHING_PLIP_RELATED_INFO":
      return {
        ...state,
        isFetchingPlipRelatedInfo: payload.isFetching,
        fetchPlipRelatedInfoError: null,
      };
    case "PLIP_FETCH_PLIP_RELATED_INFO_ERROR":
      return {
        ...state,
        fetchPlipRelatedInfoError: true,
      };
    case "PLIP_PLIPS_SIGN_INFO_FETCHED":
      return {
        ...state,
        plipsSignInfo: { ...state.plipsSignInfo, ...payload.signInfo },
      };
    case "PLIP_CLEAR_INFO":
      return {
        ...state,

        currentSigningPlip: null,
        fetchPlipRelatedInfoError: null,
        justSignedPlips: {},
        shortSigners: null,
        shortSignersTotal: null,
      };
    case "SESSION_CLEAR_SESSION":
      return {
        ...state,
        fetchPlipRelatedInfoError: null,
        userSignInfo: {},
        justSignedPlips: {},
      };
    default:
      return state;
  }
};
