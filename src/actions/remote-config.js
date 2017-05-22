export const fetchRemoteLinks = () => ({
  type: "REMOTE_CONFIG_FETCH_LINKS",
});

export const remoteLinksFetched = links => ({
  type: "REMOTE_CONFIG_FETCHED_LINKS",
  payload: { links },
});
