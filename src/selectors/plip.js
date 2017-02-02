
export const findPlips = state => state.plip.plips;

export const findCurrentPlip = state => state.plip.currentPlip;

export const isFetchingPlips = state => !!state.plip.isFetchingPlips;

export const isSigningPlip = state => state.plip.isSigning;

export const errorFetchingPlips = state => state.plip.errorFetchingPlips;

export const getUserSignInfo = state => state.plip.userSignInfo;

export const getPlipSignInfo = state => state.plip.plipSignInfo;

export const getUserCurrentPlipSignInfo = state => {
  const currentPlip = findCurrentPlip(state);
  return currentPlip && state.plip.userSignInfo[currentPlip.id];
}

export const hasUserJustSignedPlip = state => {
  const currentPlip = findCurrentPlip(state);
  return currentPlip && state.plip.justSignedPlips[currentPlip.id];
}

export const getCurrentPlipShortSignersInfo = state => ({
  users: state.plip.shortSigners,
  total: state.plip.shortSignersTotal,
});

export const isFetchingPlipSigners = state => state.plip.isFetchingSigners;

export const getPlipSigners = state => state.plip.signers;

export const hasSignersFetchError = state => state.plip.signersFetchError;

export const getCurrentSigningPlip = state => state.plip.currentSigningPlip;

export const wasUserSiginingBefore = state => findCurrentPlip(state) && getCurrentSigningPlip(state);
