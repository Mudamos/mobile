import Config from "react-native-config";
import { isDev } from "./utils";

import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import reducer from "./reducers";
import sagas from "./sagas";

import Analytics from "./services/analytics";
import ApiError from "./services/api-error";
import Crypto from "./services/crypto";
import DeviceInfoService from "./services/device-info";
import { defaultStorage } from "./services/local-storage";
import LocationService from "./services/location";
import MUDFirebaseDynamicLink from "./services/mud-firebase-dynamic-link";
import MudamosSigner from "./services/mudamos-signer";
import MudamosWebApi from "./services/mudamos-web";
import MobileApi from "./services/mobile-api";
import PermissionService from "./services/permission";
import RemoteConfigService from "./services/remote-config";
import SessionManager from "./services/session";
import TrackingTransparency from "./services/tracking-transparency";
import WalletManager from "./services/wallet";

import * as repositories from "./repositories";

const localStorage = defaultStorage();
const DeviceInfo = DeviceInfoService({ storage: localStorage });
const sessionStore = SessionManager(Config.STORAGE_ROOT_PREFIX, {
  suite: Config.IOS_APP_GROUP,
});
const walletStore = WalletManager(Config.STORAGE_ROOT_PREFIX, {
  suite: Config.IOS_APP_GROUP,
  DeviceInfo,
});

const mudDynamicLink = new MUDFirebaseDynamicLink();

export const storeBuilder = () => {
  const sagaRunner = createSagaMiddleware();
  const logger = createLogger({
    collapsed: true,
    colors: {
      title: false,
      prevState: false,
      action: false,
      nextState: false,
      error: false,
    },
    diff: true,
    level: {
      prevState: false,
      action: "log",
      nextState: "log",
      error: "error",
    },
  });

  const store = isDev
    ? createStore(reducer, applyMiddleware(sagaRunner, logger))
    : createStore(reducer, applyMiddleware(sagaRunner));

  return {
    store,

    run() {
      sagaRunner.run(sagas, {
        analytics: Analytics(),
        apiError: ApiError(),
        Crypto,
        dispatch: store.dispatch,
        DeviceInfo,
        localStorage,
        locationService: LocationService,
        mudDynamicLink,
        mudamosSigner: MudamosSigner(),
        mudamosWebApi: MudamosWebApi(Config.MUDAMOS_WEB_API_URL),
        mobileApi: MobileApi(Config.MOBILE_API_URL),
        permissionService: PermissionService(),
        RemoteConfigService,
        repositories,
        sessionStore,
        trackingTransparency: TrackingTransparency(),
        walletStore,
      });
    },
  };
};
