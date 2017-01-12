export const fetchPlips = () => ({
  type: "FETCH_PLIPS",
});

export const setCurrentPlip = currentPlip => ({
  type: "PLIP_SET_CURRENT_PLIP",
  payload: { currentPlip },
});

export const fetchingPlips = isFetching => ({
  type: "PLIPS_FETCHING",
  payload: { isFetching },
});

export const plipsFetched = plips => ({
  type: "PLIPS_FETCHED",
  payload: { plips },
});

export const signPlip = ({ plip }) => ({
  type: "PLIP_SIGN",
  payload: { plip },
});

export const plipJustSigned = ({ plipId }) => ({
  type: "PLIP_JUST_SIGNED",
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

export const plipsFetchError = error => ({
  type: "ERROR_FETCHING_PLIPS",
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
