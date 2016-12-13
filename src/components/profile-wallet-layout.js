import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import Layout from "./layout";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";

export default class ProfilePhoneLayout extends Component {
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
      <View style={{flex: 1, backgroundColor: "purple"}}>
        <PageLoader isVisible={isCreatingWallet} />

        <Layout>
          <HeaderLogo />

          <FlatButton
            enabled={hasError}
            title={locale.retry}
            onPress={onRetry}
            style={{marginHorizontal: 20}}
          />

        </Layout>
      </View>
    );
  }
}
