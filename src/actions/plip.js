export const fetchPlips = ({ shouldIncreaseAppLoading } = {}) => ({
  type: "FETCH_PLIPS",
  payload: { shouldIncreaseAppLoading },
});

export const fetchPlipsNextPage = ({ typeList, nextPage }) => ({
  type: "FETCH_PLIPS_NEXT_PAGE",
  payload: { typeList, nextPage },
});

export const refreshPlips = ({ typeList }) => ({
  type: "PLIPS_REFRESH_PLIPS",
  payload: { typeList },
});

export const plipsFetchNextPageError = error => ({
  type: "FETCHING_PLIPS_NEXT_PAGE_ERROR",
  payload: { error },
});

export const resetUserPlips = () => ({
  type: "RESET_USER_PLIPS",
});

export const resetUserLocationPlips = () => ({
  type: "RESET_USER_LOCATION_PLIPS",
});

export const refreshAllPlips = ({ plips, page, nextPage }) => ({
  type: "REFRESH_ALL_PLIPS",
  payload: { plips, page, nextPage },
});

export const refreshNationwidePlips = ({ plips, page, nextPage }) => ({
  type: "REFRESH_NATIONWIDE_PLIPS",
  payload: { plips, page, nextPage },
});

export const refreshPlipsByLocation = ({ plips, page, nextPage }) => ({
  type: "REFRESH_PLIPS_BY_USER_LOCATION",
  payload: { plips, page, nextPage },
});

export const refreshSignedPlips = ({ plips, page, nextPage }) => ({
  type: "REFRESH_SIGNED_PLIPS",
  payload: { plips, page, nextPage },
});

export const refreshFavoritePlips = ({ plips, page, nextPage }) => ({
  type: "REFRESH_FAVORITE_PLIPS",
  payload: { plips, page, nextPage },
});

export const allPlipsFetched = ({ plips, page, nextPage }) => ({
  type: "ALL_PLIPS_FETCHED",
  payload: { plips, page, nextPage },
});

export const nationwidePlipsFetched = ({ plips, page, nextPage }) => ({
  type: "NATIONWIDE_PLIPS_FETCHED",
  payload: { plips, page, nextPage },
});

export const plipsByLocationFetched = ({ plips, page, nextPage }) => ({
  type: "PLIPS_BY_USER_LOCATION_FETCHED",
  payload: { plips, page, nextPage },
});

export const signedPlipsFetched = ({ plips, page, nextPage }) => ({
  type: "SIGNED_PLIPS_FETCHED",
  payload: { plips, page, nextPage },
});

export const favoritePlipsFetched = ({ plips, page, nextPage }) => ({
  type: "FAVORITE_PLIPS_FETCHED",
  payload: { plips, page, nextPage },
});

export const refreshingAllPlips = isRefreshing => ({
  type: "REFRESHING_ALL_PLIPS",
  payload: { isRefreshing },
});

export const refreshingNationwidePlips = isRefreshing => ({
  type: "REFRESHING_NATIONWIDE_PLIPS",
  payload: { isRefreshing },
});

export const refreshingPlipsByLocation = isRefreshing => ({
  type: "REFRESHING_PLIPS_BY_USER_LOCATION",
  payload: { isRefreshing },
});

export const refreshingSignedPlips = isRefreshing => ({
  type: "REFRESHING_SIGNED_PLIPS",
  payload: { isRefreshing },
});

export const refreshingFavoritePlips = isRefreshing => ({
  type: "REFRESHING_FAVORITE_PLIPS",
  payload: { isRefreshing },
});

export const fetchingAllPlips = isFetching => ({
  type: "FETCHING_ALL_PLIPS",
  payload: { isFetching },
});

export const fetchingNationwidePlips = isFetching => ({
  type: "FETCHING_NATIONWIDE_PLIPS",
  payload: { isFetching },
});

export const fetchingPlipsByLocation = isFetching => ({
  type: "FETCHING_PLIPS_BY_USER_LOCATION",
  payload: { isFetching },
});

export const fetchingSignedPlips = isFetching => ({
  type: "FETCHING_SIGNED_PLIPS",
  payload: { isFetching },
});

export const fetchingFavoritePlips = isFetching => ({
  type: "FETCHING_FAVORITE_PLIPS",
  payload: { isFetching },
});

export const fetchingAllPlipsNextPage = isFetchingNextPage => ({
  type: "FETCHING_ALL_PLIPS_NEXT_PAGE",
  payload: { isFetchingNextPage },
});

export const fetchingNationwidePlipsNextPage = isFetchingNextPage => ({
  type: "FETCHING_NATIONWIDE_PLIPS_NEXT_PAGE",
  payload: { isFetchingNextPage },
});

export const fetchingPlipsByLocationNextPage = isFetchingNextPage => ({
  type: "FETCHING_PLIPS_BY_USER_LOCATION_NEXT_PAGE",
  payload: { isFetchingNextPage },
});

export const fetchingSignedPlipsNextPage = isFetchingNextPage => ({
  type: "FETCHING_SIGNED_PLIPS_NEXT_PAGE",
  payload: { isFetchingNextPage },
});

export const fetchingFavoritePlipsNextPage = isFetchingNextPage => ({
  type: "FETCHING_FAVORITE_PLIPS_NEXT_PAGE",
  payload: { isFetchingNextPage },
});

export const isAddingFavoritePlip = isAddingFavorite => ({
  type: "ADDING_FAVORITE_PLIP",
  payload: { isAddingFavorite },
});

export const allPlipsError = error => ({
  type: "ALL_PLIPS_ERROR",
  payload: { error },
});

export const nationwidePlipsError = error => ({
  type: "NATIONWIDE_PLIPS_ERROR",
  payload: { error },
});

export const plipsByLocationError = error => ({
  type: "PLIPS_BY_USER_LOCATION_ERROR",
  payload: { error },
});

export const signedPlipsError = error => ({
  type: "SIGNED_PLIPS_ERROR",
  payload: { error },
});

export const favoritePlipsError = error => ({
  type: "FAVORITE_PLIPS_ERROR",
  payload: { error },
});

export const plipsRefreshError = error => ({
  type: "PLIPS_REFRESH_ERROR",
  payload: { error },
});

export const fetchFilteredPlips = () => ({
  type: "FETCH_FILTERED_PLIPS",
});

export const fetchFilteredPlipsNextPage = () => ({
  type: "FETCH_FILTERED_PLIPS_NEXT_PAGE",
});

export const refreshFilteredPlips = () => ({
  type: "PLIPS_REFRESH_FILTERED_PLIPS",
});

export const fetchNationwidePlips = () => ({
  type: "FETCH_NATIONWIDE_PLIPS",
});

export const fetchStatewidePlips = () => ({
  type: "PLIPS_FETCH_STATEWIDE_PLIPS",
});

export const fetchCitywidePlips = () => ({
  type: "PLIPS_FETCH_CITYWIDE_PLIPS",
});

export const fetchingShortPlipSigners = isFetching => ({
  type: "PLIP_FETCHING_SHORT_SIGNERS",
  payload: { isFetching },
});

export const fetchingPlipSigners = isFetching => ({
  type: "PLIP_FETCHING_SIGNERS",
  payload: { isFetching },
});

export const shortPlipSigners = ({ users, total }) => ({
  type: "PLIP_SHORT_SIGNERS",
  payload: { users, total },
});

export const plipSigners = ({ signers }) => ({
  type: "PLIP_SIGNERS",
  payload: { signers },
});

export const fetchPlipSigners = plipId => ({
  type: "PLIP_FETCH_SIGNERS",
  payload: { plipId },
});

export const signPlip = ({ plip }) => ({
  type: "PLIP_SIGN",
  payload: { plip },
});

export const plipJustSigned = ({ plipId }) => ({
  type: "PLIP_JUST_SIGNED",
  payload: { plipId },
});

export const removeJustSignedPlip = ({ plipId }) => ({
  type: "PLIP_REMOVE_JUST_SIGNED",
  payload: { plipId },
});

export const plipSignError = error => ({
  type: "PLIP_SIGN_ERROR",
  payload: { error },
});

export const fetchPlipSignersError = error => ({
  type: "PLIP_FETCH_SIGNERS_ERROR",
  payload: { error },
});

export const plipUserSignInfo = ({ plipId, info }) => ({
  type: "PLIP_USER_SIGN_INFO",
  payload: { plipId, info },
});

export const clearPlipSigners = () => ({
  type: "PLIP_CLEAR_SIGNERS",
});

export const clearPlipSignersError = () => ({
  type: "PLIP_CLEAR_SIGNERS_ERROR",
});

export const signingPlip = plip => ({
  type: "PLIP_SIGNING_PLIP",
  payload: { plip },
});

export const fetchPlipRelatedInfo = plipId => ({
  type: "PLIP_FETCH_PLIP_RELATED_INFO",
  payload: { plipId },
});

export const fetchPlipRelatedInfoError = error => ({
  type: "PLIP_FETCH_PLIP_RELATED_INFO_ERROR",
  payload: { error },
});

export const fetchingPlipRelatedInfo = isFetching => ({
  type: "PLIP_FETCHING_PLIP_RELATED_INFO",
  payload: { isFetching },
});

export const clearPlipInfo = () => ({
  type: "PLIP_CLEAR_INFO",
});

export const plipsSignInfoFetched = ({ signInfo }) => ({
  type: "PLIP_PLIPS_SIGN_INFO_FETCHED",
  payload: { signInfo },
});

export const plipsFavoriteInfoFetched = ({ favoriteInfo }) => ({
  type: "PLIP_PLIPS_FAVORITE_INFO_FETCHED",
  payload: { favoriteInfo },
});

export const setCurrentPlip = plip => ({
  type: "SET_CURRENT_PLIP",
  payload: { plip },
});

export const toggleFavorite = ({ detailId }) => ({
  type: "TOGGLE_FAVORITE",
  payload: { detailId },
});

export const searchPlip = title => ({
  type: "SEARCH_PLIP",
  payload: { title },
});

export const isSearchingPlip = isSearching => ({
  type: "PLIP_SEARCHING",
  payload: { isSearching },
});

export const clearSearchPlip = () => ({
  type: "CLEAR_SEARCH_PLIP",
});
