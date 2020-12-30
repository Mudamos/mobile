import PropTypes from "prop-types";
import React, { Component } from "react";

import { SafeAreaView, StyleSheet } from "react-native";

import { WebView } from "react-native-webview";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";

export default class PrivacyPolicyLayout extends Component {
  state = {
    initialized: false,
    loading: true,
  };

  static propTypes = {
    source: PropTypes.object,
    onBack: PropTypes.func.isRequired,
  };

  onLoadEnd = () => this.setState({ loading: false, initialized: true });

  render() {
    const { source } = this.props;
    const { loading } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          <WebView source={source} onLoadEnd={this.onLoadEnd} />
        </Layout>

        <PageLoader isVisible={loading} />
      </SafeAreaView>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
});
