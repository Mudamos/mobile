export const isAppReady = state => state.app.isReady;

export const mainAppInitiated = state => state.app.mainInitiated;

export const appLoadingCompleted = state => 100 * state.app.appLoading / state.app.appLoadingTotal
