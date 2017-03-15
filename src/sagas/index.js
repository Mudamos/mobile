import { spawn } from "redux-saga/effects";

import appStateSaga from "./app-state";
import errorSaga from "./error";
import facebookSaga from "./facebook";
import authenticationSaga from "./authentication";
import passwordSaga from "./password";
import permissionSaga from "./permission";
import plipSaga from "./plip";
import profileSaga from "./profile";
import navigationSaga from "./navigation";
import sessionSaga from "./session";
import shareSaga from "./share";
import addressSaga from "./address";
import linkingSaga from "./linking";
import localStorageSaga from "./local-storage";
import locationSaga from "./location";
import walletSaga from "./wallet";

export default function* rootSaga({
  apiError,
  Crypto,
  DeviceInfo,
  localStorage,
  locationService,
  mudamosWebApi,
  mobileApi,
  permissionService,
  sessionStore,
  walletStore,
}) {
  yield spawn(appStateSaga);
  yield spawn(navigationSaga, { mobileApi, sessionStore });
  yield spawn(facebookSaga, { sessionStore, mobileApi, Crypto });
  yield spawn(authenticationSaga, { sessionStore, mobileApi });
  yield spawn(passwordSaga, { mobileApi, sessionStore, Crypto });
  yield spawn(permissionSaga, { permissionService });
  yield spawn(plipSaga, { apiError, mobileApi, mudamosWebApi, walletStore });
  yield spawn(profileSaga, { mobileApi, DeviceInfo, sessionStore, Crypto });
  yield spawn(errorSaga);
  yield spawn(sessionSaga, { mobileApi, sessionStore });
  yield spawn(shareSaga);
  yield spawn(addressSaga, { mobileApi });
  yield spawn(linkingSaga);
  yield spawn(localStorageSaga, { localStorage });
  yield spawn(locationSaga, { locationService, permissionService });
  yield spawn(walletSaga, { mobileApi, walletStore });
}
