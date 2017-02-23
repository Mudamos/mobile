import { Actions } from "react-native-router-flux";

import {
  clearChangeForgotPasswordError,
  clearChangePasswordError,
  clearPlipInfo,
  clearPlipSigners,
  clearPlipSignersError,
  clearProfileSaveErrors,
  signingPlip,
} from "./actions";

import { isDev } from "./utils";

const defaultBackAction = () => {
  try {
    Actions.pop();
    return true;
  } catch (err) {
    // There is no view to pop. Leave the app.
    return false;
  }
};

// By returning false, we don't allow the user to go back
// on the stack, instead he/she leaves the app.
export default store => () => {
  const state = store.getState();
  const currentKey = state.navigation.currentKey || "";

  if (isDev) console.log("Current scene key: ", currentKey);

  switch (currentKey) {
    case "changeForgotPassword":
      store.dispatch(clearChangeForgotPasswordError());
      return defaultBackAction();
    case "changePassword":
      store.dispatch(clearChangePasswordError());
      return defaultBackAction();
    case "showPlip":
      store.dispatch(clearPlipInfo());
      return defaultBackAction();
    case "profileUpdate":
    case "signers":
      store.dispatch(clearPlipSigners());
      store.dispatch(clearPlipSignersError());
      return defaultBackAction();
    case "signUp":
      store.dispatch(clearProfileSaveErrors());
      store.dispatch(signingPlip(null));
      return defaultBackAction();
    case "profileAddress":
    case "profileAvatar":
    case "profileBirth":
    case "profileDocuments":
    case "profileMissingFields":
    case "profilePhone":
    case "profileWallet":
      return false;
    default:
      return defaultBackAction();
  }
}
