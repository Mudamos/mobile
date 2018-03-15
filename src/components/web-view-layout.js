import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  View,
  WebView,
} from "react-native";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import BackButton from "./back-button";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";

import styles from "../styles/web-view-layout";


export default class WebViewLayout extends Component {
  state = {
    loading: true,
  }

  static propTypes = {
    onBack: PropTypes.func.isRequired,

    ...WebView.propTypes,
  }

  render() {
    const {
      ...webViewProps
    } = this.props;

    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          <WebView
            {...webViewProps}
            onLoadEnd={this.onLoadEnd.bind(this)}
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

  onLoadEnd() {
    const { onLoadEnd } = this.props;

    this.setState({ loading: false });

    onLoadEnd && onLoadEnd();
  }
}
