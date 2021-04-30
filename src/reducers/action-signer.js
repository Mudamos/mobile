import { set, lensPath } from "ramda";
const initialState = {
  error: false,
  done: false,
  message: null,
  signature: null,
  publicKey: null,
  timestamp: null,
  integrator: {
    url: null,
  },
};

export default (state = initialState, action) => {
  if (!action) return state;

  const { type } = action;

  switch (type) {
    case "ACTION_SIGNER_SIGN_ERROR": {
      const { message } = action.payload;

      return {
        ...state,
        error: true,
        done: true,
        message,
      };
    }
    case "ACTION_SIGNER_SIGN_SUCCESS": {
      const { message, signature, publicKey, timestamp } = action.payload;

      return {
        ...state,

        done: true,
        message,
        signature,
        publicKey,
        timestamp,
      };
    }
    case "ACTION_SIGNER_SET_URL": {
      return set(lensPath(["integrator", "url"]), action.payload.url, state);
    }
    case "ACTION_SIGNER_INTEGRATOR_SIGN_ERROR": {
      return set(
        lensPath(["integrator", "error"]),
        action.payload.error,
        state,
      );
    }
    case "ACTION_SIGNER_RESET":
    case "ACTION_SIGN_APP_SETUP": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
