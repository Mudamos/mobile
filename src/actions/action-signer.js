export const signMessage = () => ({
  type: "ACTION_SIGNER_SIGN_MESSAGE",
});

export const actionSignerError = ({ message }) => ({
  type: "ACTION_SIGNER_SIGN_ERROR",
  payload: { message },
});

export const actionSignerIntegratorError = (error) => ({
  type: "ACTION_SIGNER_INTEGRATOR_SIGN_ERROR",
  payload: { error },
});

export const actionSignerSuccess = ({
  message,
  signature,
  timestamp,
  publicKey,
}) => ({
  type: "ACTION_SIGNER_SIGN_SUCCESS",
  payload: {
    message,
    signature,
    timestamp,
    publicKey,
  },
});

export const actionSignerReset = () => ({
  type: "ACTION_SIGNER_RESET",
});

export const actionSignerSetUrl = ({ url }) => ({
  type: "ACTION_SIGNER_SET_URL",
  payload: { url },
});

export const actionSignerProceedSignMessageWithUrl = ({ url }) => ({
  type: "ACTION_SIGNER_PROCEED_SIGN_MESSAGE",
  payload: { url },
});
