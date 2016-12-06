import { combineReducers } from "redux";

import facebook from "./facebook";
import plip from "./plip";
import profile from "./profile";
import session from "./session";
import navigation from "./navigation";
import address from "./address";

export default combineReducers({
  facebook,
  profile,
  plip,
  session,
  navigation,
  address,
});
