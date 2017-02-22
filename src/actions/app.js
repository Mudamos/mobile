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

