export const findPlips = state => state.plip.plips;

export const isFetchingPlips = state => !!state.plip.isFetchingPlips;

export const isRefreshingPlips = state => !!state.plip.isRefreshingPlips;

export const isSigningPlip = state => state.plip.isSigning;

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;

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

export const getCurrentPlipsPage = state => state.plip.currentPlipsPage;

export const getNextPlipsPage = state => state.plip.nextPlipsPage;

export const isFetchingNextPlipsPage = state => state.plip.isFetchingNextPlipsPage;

export const isFetchingPlipRelatedInfo = state => state.plip.isFetchingPlipRelatedInfo;

export const fetchPlipRelatedInfoError = state => state.plip.fetchPlipRelatedInfoError;
