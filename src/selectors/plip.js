
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
