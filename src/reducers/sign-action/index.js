import { combineReducers } from "redux";

import profile from "../profile";
import session from "../session";
import wallet from "../wallet";

const initialState = {
  isSignApp: true,
  error: {},
  result: {},
};

const signApp = (state = initialState, action) => {
  if (!action) return state;

  const { type } = action;

  switch (type) {
    case "SIGNER_ERROR": {
      const { message } = action.payload;

      return {
        ...state,
        error: {
          hasError: true,
          message,
        },
      };
    }
    case "SIGNER_SUCCESS": {
      const { message, signedMessage, publicKey, timestamp } = action.payload;

      return {
        ...state,
        result: {
          message,
          signedMessage,
          publicKey,
          timestamp,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export default combineReducers({
  profile,
  session,
  signApp,
  wallet,
});
