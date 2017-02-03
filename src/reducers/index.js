import { combineReducers } from "redux";

import app from "./app";
import facebook from "./facebook";
import localStorage from "./local-storage";
import password from "./password";
import plip from "./plip";
import profile from "./profile";
import session from "./session";
import navigation from "./navigation";
import address from "./address";
import wallet from "./wallet";

export default combineReducers({
  app,
  facebook,
  localStorage,
  password,
  profile,
  plip,
  session,
  navigation,
  address,
  wallet,
});
