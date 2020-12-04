export const isAppReady = (state) => state.app.isReady;

export const mainAppInitiated = (state) => state.app.mainInitiated;

export const appLoadingProgress = (state) =>
  state.app.appLoading / state.app.appLoadingTotal;
