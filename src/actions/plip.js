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

export const changePlipsFilterScope = ({ scope }) => ({
  type: "PLIPS_CHANGE_FILTER_SCOPE",
  payload: { scope },
});

export const changePlipsFilterState = ({ state }) => ({
  type: "PLIPS_CHANGE_FILTER_STATE",
  payload: { state },
});

export const changePlipsFilterCity = ({ city }) => ({
  type: "PLIPS_CHANGE_FILTER_CITY",
  payload: { city },
});

export const fetchingNationwidePlips = isFetching => ({
  type: "PLIPS_NATIONWIDE_FETCHING",
  payload: { isFetching },
});

export const refreshNationwidePlips = () => ({
  type: "PLIPS_REFRESH_NATIONWIDE_PLIPS",
});

export const refreshStatewidePlips = () => ({
  type: "PLIPS_REFRESH_STATEWIDE_PLIPS",
});

export const refreshCitywidePlips = () => ({
  type: "PLIPS_REFRESH_CITYWIDE_PLIPS",
});

export const isRefreshingNationwidePlips = isRefreshing => ({
  type: "PLIPS_REFRESHING_NATIONWIDE_PLIPS",
  payload: { isRefreshing },
});

export const nationwidePlipsRefreshError = error => ({
  type: "PLIPS_NATIONWIDE_REFRESH_ERROR",
  payload: { error },
});

export const statewidePlipsRefreshError = error => ({
  type: "PLIPS_STATEWIDE_REFRESH_ERROR",
  payload: { error },
});

export const citywidePlipsRefreshError = error => ({
  type: "PLIPS_CITYWIDE_REFRESH_ERROR",
  payload: { error },
});

export const fetchNationwidePlipsNextPage = ({ page }) => ({
  type: "PLIPS_FETCH_NATIONWIDE_PLIPS_NEXT_PAGE",
  payload: { page },
});

export const fetchStatewidePlipsNextPage = ({ page }) => ({
  type: "PLIPS_FETCH_STATEWIDE_PLIPS_NEXT_PAGE",
  payload: { page },
});

export const fetchCitywidePlipsNextPage = ({ page }) => ({
  type: "PLIPS_FETCH_CITYWIDE_PLIPS_NEXT_PAGE",
  payload: { page },
});

export const plipsFetchNationwidePlipsNextPageError = error => ({
  type: "PLIPS_FETCH_NATIONWIDE_PLIPS_NEXT_PAGE_ERROR",
  payload: { error },
});

export const plipsFetchStatewidePlipsNextPageError = error => ({
  type: "PLIPS_FETCH_STATEWIDE_PLIPS_NEXT_PAGE_ERROR",
  payload: { error },
});

export const plipsFetchCitywidePlipsNextPageError = error => ({
  type: "PLIPS_FETCH_CITYWIDE_PLIPS_NEXT_PAGE_ERROR",
  payload: { error },
});

export const fetchingNextNationwidePlipsPage = isFetching => ({
  type: "PLIPS_FETCHING_NEXT_NATIONWIDE_PLIPS_PAGE",
  payload: { isFetching },
});

export const plipsAppendNationwidePlips = ({ plips, page, nextPage }) => ({
  type: "PLIPS_APPEND_NATIONWIDE_PLIPS",
  payload: { plips, page, nextPage },
});

export const plipsAppendStatewidePlips = ({ plips, page, nextPage }) => ({
  type: "PLIPS_APPEND_STATEWIDE_PLIPS",
  payload: { plips, page, nextPage },
});

export const plipsAppendCitywidePlips = ({ plips, page, nextPage }) => ({
  type: "PLIPS_APPEND_CITYWIDE_PLIPS",
  payload: { plips, page, nextPage },
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

export const nationwidePlipsFetched = ({ plips, page, nextPage }) => ({
  type: "PLIPS_NATIONWIDE_FETCHED",
  payload: { plips, page, nextPage },
});

export const statewidePlipsFetched = ({ plips, page, nextPage }) => ({
  type: "PLIPS_STATEWIDE_FETCHED",
  payload: { plips, page, nextPage },
});

export const citywidePlipsFetched = ({ plips, page, nextPage }) => ({
  type: "PLIPS_CITYWIDE_FETCHED",
  payload: { plips, page, nextPage },
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

export const isSigningPlip = isSigning => ({
  type: "PLIP_SIGNING",
  payload: { isSigning },
});

export const plipSignError = error => ({
  type: "PLIP_SIGN_ERROR",
  payload: { error },
});

export const fetchPlipSignersError = error => ({
  type: "PLIP_FETCH_SIGNERS_ERROR",
  payload: { error },
});

export const plipsNationwideFetchError = error => ({
  type: "ERROR_FETCHING_NATIONWIDE_PLIPS",
  payload: { error },
});

export const plipsStatewideFetchError = error => ({
  type: "ERROR_FETCHING_STATEWIDE_PLIPS",
  payload: { error },
});

export const plipsCitywideFetchError = error => ({
  type: "ERROR_FETCHING_CITYWIDE_PLIPS",
  payload: { error },
});

export const plipUserSignInfo = ({ plipId, info }) => ({
  type: "PLIP_USER_SIGN_INFO",
  payload: { plipId, info },
});

export const fetchingPlipSignInfo = isFetchingPlipSignInfo => ({
  type: "PLIP_FETCHING_PLIP_SIGN_INFO",
  payload: { isFetchingPlipSignInfo },
});

export const fetchingUserSignInfo = isFetchingUserSignInfo => ({
  type: "PLIP_FETCHING_USER_SIGN_INFO",
  payload: { isFetchingUserSignInfo },
});

export const plipSignInfoFetched = ({ plipId, info }) => ({
  type: "PLIP_SIGN_INFO_FETCHED",
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
