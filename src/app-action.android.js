import React, { Component } from "react";
import { Provider } from "react-redux";

import {
  ActionSignerContainer,
} from "./containers/action-signer";

import {
  appSetup,
} from "./actions";

const AppBuilder = store =>
  class App extends Component {
    componentDidMount() {
      store.dispatch(appSetup());
    }

    render() {
      return (
        <Provider store={store}>
          <ActionSignerContainer />
        </Provider>
      );
    }
  }

export default AppBuilder
