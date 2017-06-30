export const fetchRemoteLinks = () => ({
  type: "REMOTE_CONFIG_FETCH_LINKS",
});

export const remoteLinksFetched = links => ({
  type: "REMOTE_CONFIG_FETCHED_LINKS",
  payload: { links },
});

export const fetchRemoteConfig = () => ({
  type: "REMOTE_CONFIG_FETCH_ALL",
});

export const remoteConfigFetched = config => ({
  type: "REMOTE_CONFIG_FETCHED",
  payload: { config },
});
