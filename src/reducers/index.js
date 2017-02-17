import { combineReducers } from "redux";

import app from "./app";
import appState from "./app-state";
import facebook from "./facebook";
import localStorage from "./local-storage";
import location from "./location";
import password from "./password";
import permission from "./permission";
import plip from "./plip";
import profile from "./profile";
import session from "./session";
import navigation from "./navigation";
import address from "./address";
import wallet from "./wallet";

export default combineReducers({
  app,
  appState,
  facebook,
  localStorage,
  location,
  password,
  permission,
  profile,
  plip,
  session,
  navigation,
  address,
  wallet,
});
