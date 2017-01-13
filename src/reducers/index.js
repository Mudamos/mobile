import { combineReducers } from "redux";

import facebook from "./facebook";
import password from "./password";
import plip from "./plip";
import profile from "./profile";
import session from "./session";
import navigation from "./navigation";
import address from "./address";
import wallet from "./wallet";

export default combineReducers({
  facebook,
  password,
  profile,
  plip,
  session,
  navigation,
  address,
  wallet,
});
