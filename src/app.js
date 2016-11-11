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

export default class App extends Component {
  state = {};

  constructor(...args) {
    super(...args);

    store.subscribe(() => {
      const state = store.getState()
      console.log('my store', state);
      this.setState({ testing: state.plips.testing });
    });
  }

  render() {
    console.log(Config.MUDAMOS_API_URL);
    console.log('render', this.state)
    const { testing } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native! { testing }
        </Text>
        <Button
          onPress={() => { store.dispatch({type: 'TEST'})} }
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Text style={styles.instructions}>
          To get started, edit index.android.js
        </Text>
        <Text style={styles.instructions}>
          Double tap R on your keyboard to reload,{"\n"}
          Shake or press menu button for dev menu
        </Text>
      </View>
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
