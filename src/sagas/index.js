import { fork, spawn } from "redux-saga/effects";

import appleSignInSaga from "./apple-sign-in";
import analyticsSaga from "./analytics";
import appStateSaga from "./app-state";
import citySaga from "./city";
import errorSaga from "./error";
import facebookSaga from "./facebook";
import featureSaga from "./feature";
import authenticationSaga from "./authentication";
import passwordSaga from "./password";
import permissionSaga from "./permission";
import plipSaga from "./plip";
import profileSaga from "./profile";
import stateSaga from "./state";
import navigationSaga from "./navigation";
import notificationSaga from "./notification";
import qrCodeScan from "./qr-code-scan";
import remoteConfigSaga from "./remote-config";
import sessionSaga from "./session";
import shareSaga from "./share";
import addressSaga from "./address";
import linkingSaga from "./linking";
import localStorageSaga from "./local-storage";
import locationSaga from "./location";
import walletSaga from "./wallet";
import setupSaga from "./setup";
import voteConfirmationSaga from "./vote-confirmation";
import appLinkSaga from "./app-link";

import actionSignerSaga from "./action-signer";

export default function* rootSaga({
  analytics,
  apiError,
  Crypto,
  dispatch,
  DeviceInfo,
  localStorage,
  locationService,
  mudamosSigner,
  mobileApi,
  mudDynamicLink,
  permissionService,
  RemoteConfigService,
  repositories,
  sessionStore,
  walletStore,
}) {
  yield fork(actionSignerSaga, { mobileApi, mudamosSigner, walletStore });

  yield fork(appleSignInSaga, {
    Crypto,
    DeviceInfo,
    localStorage,
    mobileApi,
    sessionStore,
  });
  yield spawn(analyticsSaga, { analytics });
  yield spawn(citySaga, { repositories });
  yield spawn(navigationSaga, { mobileApi, sessionStore });
  yield spawn(facebookSaga, { sessionStore, mobileApi, Crypto });
  yield spawn(featureSaga, { RemoteConfigService });
  yield spawn(authenticationSaga, { sessionStore, mobileApi });
  yield spawn(notificationSaga, { mobileApi });
  yield spawn(passwordSaga, { mobileApi, sessionStore, Crypto });
  yield spawn(permissionSaga, { permissionService });
  yield spawn(plipSaga, {
    apiError,
    DeviceInfo,
    localStorage,
    mobileApi,
    walletStore,
  });
  yield spawn(profileSaga, {
    dispatch,
    mobileApi,
    DeviceInfo,
    sessionStore,
    Crypto,
    walletStore,
  });
  yield spawn(stateSaga, { repositories });
  yield spawn(errorSaga);
  yield spawn(remoteConfigSaga, { RemoteConfigService });
  yield spawn(sessionSaga, { mobileApi, sessionStore });
  yield spawn(shareSaga);
  yield spawn(addressSaga, { mobileApi });
  yield spawn(linkingSaga);
  yield spawn(localStorageSaga, { localStorage });
  yield spawn(locationSaga, { locationService, permissionService });
  yield spawn(walletSaga, { mobileApi, walletStore });
  yield fork(setupSaga, { mobileApi, mudamosSigner, sessionStore });
  yield spawn(appStateSaga);
  yield fork(appLinkSaga, { mobileApi, mudDynamicLink, walletStore });
  yield fork(voteConfirmationSaga, { DeviceInfo, dispatch, mobileApi });
  yield fork(qrCodeScan, { mobileApi, walletStore });
}
