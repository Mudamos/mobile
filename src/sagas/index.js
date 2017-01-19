import { spawn } from "redux-saga/effects";

import errorSaga from "./error";
import facebookSaga from "./facebook";
import authenticationSaga from "./authentication";
import passwordSaga from "./password";
import plipSaga from "./plip";
import profileSaga from "./profile";
import navigationSaga from "./navigation";
import sessionSaga from "./session";
import shareSaga from "./share";
import addressSaga from "./address";
import linkingSaga from "./linking";
import walletSaga from "./wallet";

export default function* rootSaga({
  apiError,
  mudamosWebApi,
  mobileApi,
  sessionStore,
  walletStore,
}) {
  yield spawn(navigationSaga, { mobileApi, sessionStore });
  yield spawn(facebookSaga, { sessionStore, mobileApi });
  yield spawn(authenticationSaga, { sessionStore, mobileApi });
  yield spawn(passwordSaga, { mobileApi, sessionStore });
  yield spawn(plipSaga, { apiError, mobileApi, mudamosWebApi, walletStore });
  yield spawn(profileSaga, { mobileApi, sessionStore });
  yield spawn(errorSaga);
  yield spawn(sessionSaga, { mobileApi, sessionStore });
  yield spawn(shareSaga);
  yield spawn(addressSaga, { mobileApi });
  yield spawn(linkingSaga);
  yield spawn(walletSaga, { mobileApi, walletStore });
}
