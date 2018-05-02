export const fetchPlips = () => ({
  type: "FETCH_PLIPS",
});

export const fetchPlipsNextPage = () => ({
  type: "FETCH_PLIPS_NEXT_PAGE",
});

export const refreshPlips = () => ({
  type: "PLIPS_REFRESH_PLIPS",
});

export const fetchingPlips = isFetching => ({
  type: "PLIPS_FETCHING",
  payload: { isFetching },
});

export const plipsFetchError = error => ({
  type: "ERROR_FETCHING_PLIPS",
  payload: { error },
});

export const plipsFetchNextPageError = error => ({
  type: "FETCHING_PLIPS_NEXT_PAGE_ERROR",
  payload: { error },
});

export const plipsFetched = ({ plips, page, nextPage }) => ({
  type: "PLIPS_FETCHED",
  payload: { plips, page, nextPage },
});

export const allPlipsFetched = ({ plips }) => ({
  type: "ALL_PLIPS_FETCHED",
  payload: { plips },
});

export const isRefreshingPlips = isRefreshing => ({
  type: "PLIPS_REFRESHING_PLIPS",
  payload: { isRefreshing },
});

export const plipsRefreshError = error => ({
  type: "PLIPS_REFRESH_ERROR",
  payload: { error },
});

export const addPlip = plip => ({
  type: "ADD_PLIP",
  payload: { plip },
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
