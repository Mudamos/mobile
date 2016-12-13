import Config from "react-native-config";

import React, { Component } from "react";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import {
  PlipContainer,
  ProfileAddressContainer,
  ProfileBirthContainer,
  ProfileDocumentsContainer,
  ProfilePhoneContainer,
  ProfileWalletContainer,
  SignInContainer,
  SignUpContainer,
} from "./containers";

import { fetchSession } from "./actions";

import routeReducer from "./services/route-reducer";
import backAndroidHandler from "./back-android-handler";

import MudamosWebApi from "./services/mudamos-web";
import SessionManager from "./services/session";
import WalletManager from "./services/wallet";
import MobileApi from "./services/mobile-api";
import DeviceInfo from "./services/device-info";

import reducer from "./reducers";
import sagas from "./sagas";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createReduxLogger from "redux-logger";
import createSagaMiddleware from "redux-saga";

const sagaRunner = createSagaMiddleware();
const logger = createReduxLogger({
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

// eslint-disable-next-line no-undef
const store = __DEV__ ?
  createStore(reducer, applyMiddleware(sagaRunner, logger)) :
  createStore(reducer, applyMiddleware(sagaRunner));

const sessionStore = SessionManager("@Mudamos");
const walletStore = WalletManager("@Mudamos");

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="showPlip" initial={true} component={PlipContainer} hideNavBar={true} />

    <Scene key="signIn" component={SignInContainer} hideNavBar={true} />
    <Scene key="signUp" component={SignUpContainer} hideNavBar={true} title="Identificação" />
    <Scene key="profileBirth" component={ProfileBirthContainer} hideNavBar={true} title="Data de Nascimento" />
    <Scene key="profileAddress" component={ProfileAddressContainer} hideNavBar={true} title="CEP" />
    <Scene key="profileDocuments" component={ProfileDocumentsContainer} hideNavBar={true} title="Informe seus documentos" />
    <Scene key="profilePhone" component={ProfilePhoneContainer} hideNavBar={true} title="Telefone" />
    <Scene key="profileWallet" component={ProfileWalletContainer} hideNavBar={true} title="Wallet" />
  </Scene>
);

sagaRunner.run(sagas, {
  deviceInfo: DeviceInfo(),
  mudamosWebApi: MudamosWebApi(Config.MUDAMOS_WEB_API_URL),
  mobileApi: MobileApi(Config.MOBILE_API_URL),
  sessionStore,
  walletStore,
});

store.dispatch(fetchSession());

const getSceneStyle = (props, computedProps) => sceneStyle(props, computedProps).scene

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router
          createReducer={routeReducer(store)}
          scenes={scenes}
          getSceneStyle={getSceneStyle}
          title="Mudamos"
          backAndroidHandler={backAndroidHandler(store)}
        />
      </Provider>
    );
  }
}
