import Config from "react-native-config";

import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import { PlipContainer } from "./containers";


import MudamosWebApi from "./services/mudamos-web";

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
  }
});

const store = __DEV__ ?
  createStore(reducer, applyMiddleware(sagaRunner, logger)) :
  createStore(reducer, applyMiddleware(sagaRunner));


const scenes = Actions.create(
  <Scene key="root">
    <Scene key="showPlip" initial={true} component={PlipContainer} hideNavBar={true} />
  </Scene>
);

sagaRunner.run(sagas, {
  mudamosWebApi: MudamosWebApi(Config.MUDAMOS_WEB_API_URL)
});

const getSceneStyle = (props, computedProps) => sceneStyle(props, computedProps).scene

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router scenes={scenes} getSceneStyle={getSceneStyle} title="Mudamos" />
      </Provider>
    );
  }
}
