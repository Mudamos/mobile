export const signMessage = () => ({
  type: "ACTION_SIGNER_SIGN_MESSAGE",
});

export const actionSignerError = ({ message }) => ({
  type: "ACTION_SIGNER_SIGN_ERROR",
  payload: { message },
});

export const actionSignerSuccess = ({ message, signature, timestamp, publicKey }) => ({
  type: "ACTION_SIGNER_SIGN_SUCCESS",
  payload: {
    message,
    signature,
    timestamp,
    publicKey,
  },
});

export const ationSignerReset = () => ({
  type: "ACTION_SIGNER_RESET",
});
