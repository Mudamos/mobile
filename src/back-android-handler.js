import { Actions } from "react-native-router-flux";

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
  const loggedIn = !!state.session.token;

  if (isDev) console.log("Current scene key: ", currentKey);

  switch (currentKey) {
    case "profileAddress":
    case "profileBirth":
    case "profileDocuments":
    case "profilePhone":
      return false;
    case "signUp":
      return loggedIn ? false : defaultBackAction();
    default:
      return defaultBackAction();
  }
}
