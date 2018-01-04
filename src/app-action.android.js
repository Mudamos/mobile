import React, { Component } from "react";
import Config from "react-native-config";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createReduxLogger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import {
  ActionSignerContainer,
} from "./containers/sign-action";

import {
  appSetup,
} from "./actions";

import { isDev } from "./utils";

import MobileApi from "./services/mobile-api";
import SessionManager from "./services/session";
import WalletManager from "./services/wallet";

import reducer from "./reducers/sign-action";
import sagas from "./sagas/sign-action";

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

const sessionStore = SessionManager(Config.STORAGE_ROOT_PREFIX, { suite: Config.IOS_APP_GROUP });
const walletStore = WalletManager(Config.STORAGE_ROOT_PREFIX, { suite: Config.IOS_APP_GROUP });

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="sign" initial={true} component={ActionSignerContainer} hideNavBar={true} />
  </Scene>
);

sagaRunner.run(sagas, {
  mobileApi: MobileApi(Config.MOBILE_API_URL),
  sessionStore,
  walletStore,
});

const getSceneStyle = (props, computedProps) => sceneStyle(props, computedProps).scene

export default class App extends Component {
  componentDidMount() {
    store.dispatch(appSetup());
  }

  render() {
    return (
      <Provider store={store}>
        <Router
          scenes={scenes}
          getSceneStyle={getSceneStyle}
          title="Mudamos"
        />
      </Provider>
    );
  }
}
