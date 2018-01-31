const initialState = {
  error: false,
  done: false,
  message: null,
  signature: null,
  publicKey: null,
  timestamp: null,
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
    case "ACTION_SIGNER_RESET":
    case "SETUP": {
      return {
        ...state,
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};
