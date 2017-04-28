export const findNationwidePlips = state => state.plip.nationwidePlips;

export const findStatewidePlips = state => state.plip.statewidePlips;

export const findCitywidePlips = state => state.plip.citywidePlips;

export const isFetchingNationwidePlips = state => !!state.plip.isFetchingNationwidePlips;

export const isFetchingStatewidePlips = state => !!state.plip.isFetchingStatewidePlips;

export const isFetchingCitywidePlips = state => !!state.plip.isFetchingCitywidePlips;

export const isRefreshingNationwidePlips = state => !!state.plip.isRefreshingNationwidePlips;

export const isRefreshingStatewidePlips = state => !!state.plip.isRefreshingStatewidePlips;

export const isRefreshingCitywidePlips = state => !!state.plip.isRefreshingCitywidePlips;

export const isSigningPlip = state => state.plip.isSigning;

export const errorFetchingNationwidePlips = state => state.plip.errorFetchingNationwidePlips;

export const errorFetchingStatewidePlips = state => state.plip.errorFetchingStatewidePlips;

export const errorFetchingCitywidePlips = state => state.plip.errorFetchingCitywidePlips;

export const getUserSignInfo = state => state.plip.userSignInfo;

export const getPlipSignInfo = state => state.plip.plipSignInfo;

export const getUserCurrentPlipSignInfo = (state, plipId) => state.plip.userSignInfo[plipId];

export const hasUserJustSignedPlip = (state, plipId) => state.plip.justSignedPlips[plipId];

export const getCurrentPlipShortSignersInfo = state => ({
  users: state.plip.shortSigners,
  total: state.plip.shortSignersTotal,
});

export const isFetchingPlipSigners = state => state.plip.isFetchingSigners;

export const getPlipSigners = state => state.plip.signers;

export const hasSignersFetchError = state => state.plip.signersFetchError;

export const getCurrentSigningPlip = state => state.plip.currentSigningPlip;

export const wasUserSiginingBefore = state => getCurrentSigningPlip(state);

export const getNextNationwidePlipsPage = state => state.plip.nextNationwidePlipsPage;

export const getNextStatewidePlipsPage = state => state.plip.nextStatewidePlipsPage;

export const getNextCitywidePlipsPage = state => state.plip.nextCitywidePlipsPage;

export const isFetchingNextNationwidePlipsPage = state => state.plip.isFetchingNextNationwidePlipsPage;

export const isFetchingNextStatewidePlipsPage = state => state.plip.isFetchingNextStatewidePlipsPage;

export const isFetchingNextCitywidePlipsPage = state => state.plip.isFetchingNextCitywidePlipsPage;

export const isFetchingPlipRelatedInfo = state => state.plip.isFetchingPlipRelatedInfo;

export const fetchPlipRelatedInfoError = state => state.plip.fetchPlipRelatedInfoError;

export const getPlipsFilters = state => state.plip.plipsFilters;

export const getNationwidePlipsLoadState = state => {
  const result = {
    nextPage: getNextNationwidePlipsPage(state),
    isFetchingNextPage: isFetchingNextNationwidePlipsPage(state),
    isFetchingPlips: isFetchingNationwidePlips(state),
    isRefreshing: isRefreshingNationwidePlips(state),
  };

  const { isFetchingNextPage, isFetchingPlips, isRefreshing} = result;

  // So we do not fire a fetch again
  result.isAlreadyFetching = isFetchingNextPage || isFetchingPlips || isRefreshing;

  return result;
};

export const getStatewidePlipsLoadState = state => {
  const result = {
    nextPage: getNextStatewidePlipsPage(state),
    isFetchingNextPage: isFetchingNextStatewidePlipsPage(state),
    isFetchingPlips: isFetchingStatewidePlips(state),
    isRefreshing: isRefreshingStatewidePlips(state),
  };

  const { isFetchingNextPage, isFetchingPlips, isRefreshing} = result;

  // So we do not fire a fetch again
  result.isAlreadyFetching = isFetchingNextPage || isFetchingPlips || isRefreshing;

  return result;
};

export const getCitywidePlipsLoadState = state => {
  const result = {
    nextPage: getNextCitywidePlipsPage(state),
    isFetchingNextPage: isFetchingNextCitywidePlipsPage(state),
    isFetchingPlips: isFetchingCitywidePlips(state),
    isRefreshing: isRefreshingCitywidePlips(state),
  };

  const { isFetchingNextPage, isFetchingPlips, isRefreshing} = result;

  // So we do not fire a fetch again
  result.isAlreadyFetching = isFetchingNextPage || isFetchingPlips || isRefreshing;

  return result;
};

export const findPlipsSignInfo = state => state.plip.plipsSignInfo;
