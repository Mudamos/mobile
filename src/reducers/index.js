import { combineReducers } from "redux";

import actionSigner from "./action-signer";
import app from "./app";
import appLink from "./app-link"
import appState from "./app-state";
import city from "./city";
import facebook from "./facebook";
import feature from "./feature";
import localStorage from "./local-storage";
import location from "./location";
import notification from "./notification";
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
import mainTabview from "./main-tabview";

export default combineReducers({
  actionSigner,
  address,
  app,
  appLink,
  appState,
  city,
  facebook,
  feature,
  location,
  localStorage,
  mainTabview,
  notification,
  password,
  permission,
  plip,
  profile,
  remoteConfig,
  session,
  state,
  navigation,
  wallet,
});
