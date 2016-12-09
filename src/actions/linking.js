export const openURL = url => ({
  type: "LINKING_OPEN_URL",
  payload: { url },
});

export const openURLError = error => ({
  type: "LINKING_OPEN_URL_ERROR",
  payload: { error },
});
