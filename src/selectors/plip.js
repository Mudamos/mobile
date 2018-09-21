import {
  propEq,
} from "ramda";

export const isFetchingAllPlips = state => state.plip.allPlips.isFetching;
export const isFetchingNationwidePlips = state => state.plip.nationwidePlips.isFetching;
export const isFetchingPlipsByLocation = state => state.plip.userLocationPlips.isFetching;
export const isFetchingSignedPlips = state => state.plip.signedPlips.isFetching;
export const isFetchingFavoritePlips = state => state.plip.favoritePlips.isFetching;

export const isFetchingPlipsNextPageAllPlips = state => state.plip.allPlips.isFetchingNextPage;
export const isFetchingPlipsNextPageNationwidePlips = state => state.plip.nationwidePlips.isFetchingNextPage;
export const isFetchingPlipsNextPagePlipsByLocation = state => state.plip.userLocationPlips.isFetchingNextPage;
export const isFetchingPlipsNextPageSignedPlips = state => state.plip.signedPlips.isFetchingNextPage;
export const isFetchingPlipsNextPageFavoritePlips = state => state.plip.favoritePlips.isFetchingNextPage;

export const isRefreshingAllPlips = state => state.plip.allPlips.isRefreshing;
export const isRefreshingNationwidePlips = state => state.plip.nationwidePlips.isRefreshing;
export const isRefreshingPlipsByLocation = state => state.plip.userLocationPlips.isRefreshing;
export const isRefreshingSignedPlips = state => state.plip.signedPlips.isRefreshing;
export const isRefreshingFavoritePlips = state => state.plip.favoritePlips.isRefreshing;

export const findPlip = id => state =>
  (findPlips(state) || []).find(propEq("id", id));

export const findPlips = state => {
  const {
    nationwidePlips,
    userLocationPlips,
    allPlips,
    favoritePlips,
    signedPlips,
  } = state.plip;

  return [
    ...nationwidePlips.plips,
    ...userLocationPlips.plips,
    ...allPlips.plips,
    ...favoritePlips.plips,
    ...signedPlips.plips,
  ] || [];
}

export const hasLoadedNationwidePlips = state => !!state.plip.nationwidePlips.loaded;

export const hasLoadedUserLocationPlips = state => !!state.plip.userLocationPlips.loaded;

export const hasLoadedAllPlips = state => !!state.plip.allPlips.loaded;

export const hasLoadedUserFavoritePlips = state => !!state.plip.favoritePlips.loaded;

export const hasLoadedSignedPlips = state => !!state.plip.signedPlips.loaded;

export const errorFetchingNationwidePlips = state => !!state.plip.nationwidePlips.error;

export const errorFetchingUserLocationPlips = state => !!state.plip.userLocationPlips.error;

export const errorFetchingAllPlips = state => !!state.plip.allPlips.error;

export const errorFetchingUserFavoritePlips = state => !!state.plip.favoritePlips.error;

export const errorFetchingSignedPlips = state => !!state.plip.signedPlips.error;

export const findNationwidePlips = state => state.plip.nationwidePlips.plips || [];

export const findUserLocationPlips = state => state.plip.userLocationPlips.plips || [];

export const findAllPlips = state => state.plip.allPlips.plips || [];

export const findUserFavoritePlips = state => state.plip.favoritePlips.plips || [];

export const findSignedPlips = state => state.plip.signedPlips.plips || [];

export const findNationwidePlipsNextPage = state => state.plip.nationwidePlips.nextPage;

export const findUserLocationPlipsNextPage = state => state.plip.userLocationPlips.nextPage;

export const findAllPlipsNextPage = state => state.plip.allPlips.nextPage;

export const findUserFavoritePlipsNextPage = state => state.plip.favoritePlips.nextPage;

export const findSignedPlipsNextPage = state => state.plip.signedPlips.nextPage;

export const listAllPlips = state => state.plip.allPlips;

export const getNextPlipsPage = state => state.plip.nextPlipsPage;

export const getCurrentPlipsPage = state => state.plip.currentPlipsPage;

export const getCurrentPlip = state => state.plip.currentPlip;

export const hasPlipsNextPage = state => !!getNextPlipsPage(state);

export const isSigningPlip = state => !!state.plip.currentSigningPlip;

export const isAddingFavoritePlip = state => state.plip.isAddingFavorite;

export const getUserSignInfo = state => state.plip.userSignInfo;

export const getPlipSignInfo = id => state => (findPlipsSignInfo(state) || {})[id];

export const getUserCurrentPlipSignInfo = (state, plipId) => (getUserSignInfo(state) || {})[plipId];

export const hasUserSignedPlip = plipId => state => !!((getUserCurrentPlipSignInfo(state, plipId) || {}).updatedAt)

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

export const isFetchingPlipRelatedInfo = state => state.plip.isFetchingPlipRelatedInfo;

export const fetchPlipRelatedInfoError = state => state.plip.fetchPlipRelatedInfoError;

export const findPlipsSignInfo = state => state.plip.plipsSignInfo;

export const findPlipsFavoriteInfo = state => state.plip.plipsFavoriteInfo;

export const searchPlipTitle = state => state.plip.searchPlip;

export const isSearchingPlips = state => state.plip.isSearching;

export const findPlipByPath = path => state => {
  const plips = findPlips(state);

  if (plips) {
    return plips.find(plip => {
      const plipPath = /\S+(\/temas\/\S+\/plugins\/peticao)\/?$/.exec(plip.plipUrl);

      if (plipPath && plipPath[1] === path) {
        return true;
      }
    });
  }
}

export const mostRecentNationalPlip = state => findNationwidePlips(state) && findNationwidePlips(state)[0]
