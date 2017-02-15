import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";

export default class ProfileWalletLayout extends Component {
  static propTypes = {
    hasError: PropTypes.bool,
    isCreatingWallet: PropTypes.bool,
    onRetry: PropTypes.func.isRequired,
  }

  render() {
    const {
      hasError,
      isCreatingWallet,
      onRetry,
    } = this.props;

    return (
      <View style={{flex: 1}}>
        <Layout>
          {this.renderNavBar()}

          {
            hasError &&
              <View style={{flex: 1, justifyContent: "center"}}>
                <FlatButton
                  title={locale.retry}
                  onPress={onRetry}
                  style={{marginHorizontal: 20}}
                />
              </View>
          }

        </Layout>

        <PageLoader isVisible={isCreatingWallet} />
      </View>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }
}
