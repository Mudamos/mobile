import { combineReducers } from "redux";

import app from "./app";
import appState from "./app-state";
import city from "./city";
import facebook from "./facebook";
import feature from "./feature";
import localStorage from "./local-storage";
import location from "./location";
import password from "./password";
import permission from "./permission";
import plip from "./plip";
import profile from "./profile";
import remoteConfig from "./remote-config";
import session from "./session";
import state from "./state";
import navigation from "./navigation";
import address from "./address";
import wallet from "./wallet";

export default combineReducers({
  app,
  appState,
  city,
  facebook,
  feature,
  localStorage,
  location,
  password,
  permission,
  profile,
  plip,
  remoteConfig,
  session,
  state,
  navigation,
  address,
  wallet,
});
