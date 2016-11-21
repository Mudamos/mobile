import { spawn } from "redux-saga/effects";

import errorSaga from "./error";
import facebookSaga from "./facebook";
import plipSaga from "./plip";
import navigationSaga from "./navigation";
import sessionSaga from "./session";

export default function* rootSaga({ mudamosWebApi, mobileApi, sessionStore }) {
  yield spawn(navigationSaga);
  yield spawn(facebookSaga, { sessionStore, mobileApi });
  yield spawn(plipSaga, { mudamosWebApi });
  yield spawn(errorSaga);
  yield spawn(sessionSaga, { sessionStore });
}
