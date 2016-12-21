import Config from "react-native-config";

import React, { Component } from "react";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import { isDev } from "./utils";

import {
  DocumentsReasonContainer,
  PlipContainer,
  ProfileAddressContainer,
  ProfileBirthContainer,
  ProfileDocumentsContainer,
  ProfilePhoneContainer,
  ProfileWalletContainer,
  SignInContainer,
  SignUpContainer,
} from "./containers";

import {
  existsLocalWallet,
  fetchSession,
} from "./actions";

import routeReducer from "./services/route-reducer";
import backAndroidHandler from "./back-android-handler";

import MudamosWebApi from "./services/mudamos-web";
import SessionManager from "./services/session";
import WalletManager from "./services/wallet";
import MobileApi from "./services/mobile-api";

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

const store = isDev ?
  createStore(reducer, applyMiddleware(sagaRunner, logger)) :
  createStore(reducer, applyMiddleware(sagaRunner));

const sessionStore = SessionManager("@Mudamos");
const walletStore = WalletManager("@Mudamos");

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="showPlip" initial={true} type="reset" hideNavBar={true}>
      <Scene key="plipPage" initial={true} component={PlipContainer} hideNavBar={true} />
    </Scene>

    <Scene key="signIn" component={SignInContainer} hideNavBar={true} />
    <Scene key="signUp" component={SignUpContainer} hideNavBar={true} title="Identificação" />
    <Scene key="profileBirth" component={ProfileBirthContainer} hideNavBar={true} title="Data de Nascimento" />
    <Scene key="profileAddress" component={ProfileAddressContainer} hideNavBar={true} title="CEP" />
    <Scene key="profileDocuments" component={ProfileDocumentsContainer} hideNavBar={true} title="Informe seus documentos" />
    <Scene key="profilePhone" component={ProfilePhoneContainer} hideNavBar={true} title="Telefone" />
    <Scene key="profileWallet" component={ProfileWalletContainer} hideNavBar={true} duration={0} title="Wallet" />

    <Scene key="documentsReason" component={DocumentsReasonContainer} hideNavBar={true} direction="vertical" title="Motivo dos documentos" />
  </Scene>
);

sagaRunner.run(sagas, {
  mudamosWebApi: MudamosWebApi(Config.MUDAMOS_WEB_API_URL),
  mobileApi: MobileApi(Config.MOBILE_API_URL),
  sessionStore,
  walletStore,
});

store.dispatch(fetchSession());
store.dispatch(existsLocalWallet());

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
