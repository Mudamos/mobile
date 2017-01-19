export const shareLink = ({ url, type, message, title, subject }) => ({
  type: "SHARE_LINK",
  payload: { url, type, message, title, subject },
});

export const shareLinkError = error => ({
  type: "SHARE_LINK_ERROR",
  payload: { error },
});

export const sharePlip = plip => ({
  type: "SHARE_PLIP",
  payload: { plip },
});
