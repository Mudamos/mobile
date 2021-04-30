import { ActionConst } from "react-native-router-flux";

export const SCREEN_KEYS = {
  CONFIRM_VOTE: "confirmVote",
  CONFIRM_VOTE_CODE: "confirmVoteCode",
  MESSAGE_SIGN: "messageSign",
  MESSAGE_SIGN_SUCCESS: "messageSignSuccess",
  PRIVACY_POLICY: "privacyPolicy",
  SIGN_IN: "signIn",
};

export const SCREEN_NAVIGATION_TYPES = {
  pushOrPop: ActionConst.PUSH_OR_POP,
  reset: "reset",
  replace: ActionConst.REPLACE,
};
