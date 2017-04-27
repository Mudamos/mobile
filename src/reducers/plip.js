import {
  NATIONWIDE_SCOPE,
} from "../utils";

const initialState = {
  userSignInfo: {},
  justSignedPlips: {},
  plipsFilters: {
    scope: NATIONWIDE_SCOPE,
  },
  plipsSignInfo: {},
};

export default  (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PLIPS_NATIONWIDE_FETCHED":
      return {
        ...state,
        nationwidePlips: payload.plips,
        currentNationwidePlipsPage: payload.page,
        nextNationwidePlipsPage: payload.nextPage,
      };
    case "PLIPS_STATEWIDE_FETCHED":
      return {
        ...state,
        statewidePlips: payload.plips,
        currentStatewidePlipsPage: payload.page,
        nextStatewidePlipsPage: payload.nextPage,
        isFetchingStatewidePlips: false,
        isRefreshingStatewidePlips: false,
      };
    case "PLIPS_CITYWIDE_FETCHED":
      return {
        ...state,
        citywidePlips: payload.plips,
        currentCitywidePlipsPage: payload.page,
        nextCitywidePlipsPage: payload.nextPage,
        isFetchingCitywidePlips: false,
        isRefreshingCitywidePlips: false,
      };
    case "PLIPS_APPEND_NATIONWIDE_PLIPS":
      return {
        ...state,
        nationwidePlips: (state.nationwidePlips || []).concat(payload.plips),
        currentNationwidePlipsPage: payload.page,
        nextNationwidePlipsPage: payload.nextPage,
      };
    case "PLIPS_APPEND_STATEWIDE_PLIPS":
      return {
        ...state,
        statewidePlips: (state.statewidePlips || []).concat(payload.plips),
        currentStatewidePlipsPage: payload.page,
        nextStatewidePlipsPage: payload.nextPage,
        isFetchingNextStatewidePlipsPage: false,
      };
    case "PLIPS_APPEND_CITYWIDE_PLIPS":
      return {
        ...state,
        citywidePlips: (state.citywidePlips || []).concat(payload.plips),
        currentCitywidePlipsPage: payload.page,
        nextCitywidePlipsPage: payload.nextPage,
        isFetchingNextCitywidePlipsPage: false,
      };
    case "PLIPS_NATIONWIDE_FETCHING":
      return {
        ...state,
        isFetchingNationwidePlips: payload.isFetching,
        errorFetchingNationwidePlips: false,
    };
    case "PLIPS_FETCHING_NEXT_NATIONWIDE_PLIPS_PAGE":
      return {
        ...state,
        isFetchingNextNationwidePlipsPage: payload.isFetching,
      };
    case "PLIPS_FETCH_STATEWIDE_PLIPS_NEXT_PAGE":
      return {
        ...state,
        isFetchingNextStatewidePlipsPage: true,
      };
    case "PLIPS_FETCH_CITYWIDE_PLIPS_NEXT_PAGE":
      return {
        ...state,
        isFetchingNextCitywidePlipsPage: true,
      };
    case "PLIPS_FETCH_STATEWIDE_PLIPS_NEXT_PAGE_ERROR":
      return {
        ...state,
        isFetchingNextStatewidePlipsPage: false,
      };
    case "PLIPS_FETCH_CITYWIDE_PLIPS_NEXT_PAGE_ERROR":
      return {
        ...state,
        isFetchingNextCitywidePlipsPage: false,
      };
    case "PLIPS_REFRESHING_NATIONWIDE_PLIPS":
      return {
        ...state,
        isRefreshingNationwidePlips: payload.isRefreshing,
      };
    case "PLIPS_REFRESH_STATEWIDE_PLIPS":
      return {
        ...state,
        isRefreshingStatewidePlips: true,
      };
    case "PLIPS_REFRESH_CITYWIDE_PLIPS":
      return {
        ...state,
        isRefreshingCitywidePlips: true,
      };
    case "PLIPS_STATEWIDE_REFRESH_ERROR":
      return {
        ...state,
        isRefreshingStatewidePlips: false,
      };
    case "PLIPS_CITYWIDE_REFRESH_ERROR":
      return {
        ...state,
        isRefreshingCitywidePlips: false,
      };
    case "PLIPS_FETCH_STATEWIDE_PLIPS":
      return {
        ...state,
        isFetchingStatewidePlips: true,
        errorFetchingStatewidePlips: false,
      };
    case "PLIPS_FETCH_CITYWIDE_PLIPS":
      return {
        ...state,
        isFetchingCitywidePlips: true,
        errorFetchingCitywidePlips: false,
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
    case "ERROR_FETCHING_NATIONWIDE_PLIPS":
      return {
        ...state,
        errorFetchingNationwidePlips: true,
      };
    case "ERROR_FETCHING_STATEWIDE_PLIPS":
      return {
        ...state,
        errorFetchingStatewidePlips: true,
        isFetchingStatewidePlips: false,
      };
    case "ERROR_FETCHING_CITYWIDE_PLIPS":
      return {
        ...state,
        errorFetchingCitywidePlips: true,
        isFetchingCitywidePlips: false,
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
    case "PLIPS_CHANGE_FILTER_SCOPE":
      return {
        ...state,
        plipsFilters: { ...state.plipsFilters, scope: payload.scope },
      };
    case "PLIPS_CHANGE_FILTER_STATE":
      return {
        ...state,
        plipsFilters: { ...state.plipsFilters, state: payload.state },
      };
    case "PLIPS_CHANGE_FILTER_CITY":
      return {
        ...state,
        plipsFilters: { ...state.plipsFilters, city: payload.city },
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
        plipSignInfo: null,
        shortSigners: null,
        shortSignersTotal: null,
        userSignInfo: {},
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
