import React, { Component } from "react";
import Config from "react-native-config";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createReduxLogger from "redux-logger";
import createSagaMiddleware from "redux-saga";

import {
  ActionSignerContainer,
} from "./containers/sign-action";

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

sagaRunner.run(sagas, {
  mobileApi: MobileApi(Config.MOBILE_API_URL),
  sessionStore,
  walletStore,
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ActionSignerContainer />
      </Provider>
    );
  }
}
