import { spawn } from "redux-saga/effects";

import errorSaga from "./error";
import facebookSaga from "./facebook";
import authenticationSaga from "./authentication";
import plipSaga from "./plip";
import profileSaga from "./profile";
import navigationSaga from "./navigation";
import sessionSaga from "./session";
import addressSaga from "./address";
import linkingSaga from "./linking";
import walletSaga from "./wallet";

export default function* rootSaga({ deviceInfo, mudamosWebApi, mobileApi, sessionStore }) {
  yield spawn(navigationSaga);
  yield spawn(facebookSaga, { sessionStore, mobileApi });
  yield spawn(authenticationSaga, { sessionStore, mobileApi });
  yield spawn(plipSaga, { mudamosWebApi });
  yield spawn(profileSaga, { mobileApi, sessionStore });
  yield spawn(errorSaga);
  yield spawn(sessionSaga, { sessionStore });
  yield spawn(addressSaga, { mobileApi });
  yield spawn(linkingSaga);
  yield spawn(walletSaga, { deviceInfo, mobileApi });
}
