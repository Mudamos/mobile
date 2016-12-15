export const fetchPlips = () => ({
  type: "FETCH_PLIPS",
});

export const plipsFetched = plips => ({
  type: "PLIPS_FETCHED",
  payload: { plips },
});

export const signPlip = ({ plip }) => ({
  type: "PLIP_SIGN",
  payload: { plip },
});

export const isSigningPlip = isSigning => ({
  type: "PLIP_SIGNING",
  payload: { isSigning },
});

export const plipSignError = error => ({
  type: "PLIP_SIGN_ERROR",
  payload: { error },
})

export const plipsFetchError = error => ({
  type: "ERROR_FETCHING_PLIPS",
  payload: { error },
})

export const plipUserSignInfo = ({ plipId, info }) => ({
  type: "PLIP_USER_SIGN_INFO",
  payload: { plipId, info },
})
