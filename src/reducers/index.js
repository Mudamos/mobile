import { combineReducers } from "redux";

import facebook from "./facebook";
import plip from "./plip";
import session from "./session";

export default combineReducers({
  facebook,
  plip,
  session,
});
