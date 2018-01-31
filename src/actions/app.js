export const appReady = isReady => ({
  type: "APP_READY",
  payload: { isReady },
})

export const appOnForeground = () => ({
  type: "APP_ON_FOREGROUND",
});

export const appOnBackground = () => ({
  type: "APP_ON_BACKGROUND",
});

export const appDidMount = () => ({
  type: "APP_DID_MOUNT",
});

export const appWillUnmount = () => ({
  type: "APP_WILL_UNMOUNT",
});

export const appSetup = () => ({
  type: "SETUP",
});

export const actionSignAppSetup = () => ({
  type: "ACTION_SIGN_APP_SETUP",
});

export const mainAppInitiated = () => ({
  type: "APP_MAIN_INITIATED",
});
