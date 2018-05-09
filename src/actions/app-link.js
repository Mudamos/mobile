export const appLinkHandleError = error => ({
  type: "HANDLING_APP_LINK_ERROR",
  payload: { error },
});

export const setAppLinkUrl = url => ({
  type: "SET_APP_LINK_URL",
  payload: { url },
});

export const handleAppLink = () => ({
  type: "HANDLE_APP_LINK",
})

export const clearAppLinkError = () => ({
  type: "CLEAR_APP_LINK_ERROR",
})