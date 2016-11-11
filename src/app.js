import Config from "react-native-config";

import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

sagaRunner.run(sagas);

import { PlipContainer } from "./containers";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PlipContainer />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
