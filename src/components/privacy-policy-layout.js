import PropTypes from "prop-types";
import React, { Component, createRef } from "react";
import { identity } from "ramda";

import { View } from "react-native";

import { WebView } from "react-native-webview";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";

import styles from "../styles/web-view-layout";

const onMessage = identity;

export default class WebViewLayout extends Component {
  state = {
    initialized: false,
    loading: true,
    ref: createRef(),
  };

  static propTypes = {
    source: PropTypes.object,
    onBack: PropTypes.func.isRequired,
  };

  onLoadEnd = () => {
    this.setState({ loading: false, initialized: true });

    /**
     * Because mudamos.org displays a landing page when the user
     * does not have an specific cookie, which tracks if the landing page has
     * been displayed, we have to hack in order to skip it.
     *
     * A simple solution for now is just reload the page, therefore the cookie
     * is going to be set on the second time
     */
    this.state.ref.current.reload();
  };

  render() {
    const { source } = this.props;

    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          <WebView
            ref={this.state.ref}
            source={source}
            onMessage={onMessage}
            onLoadEnd={this.onLoadEnd}
          />
        </Layout>

        <PageLoader isVisible={loading} />
      </View>
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
