import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Image,
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import SafeAreaView from "./safe-area-view";
import ScrollView from "./scroll-view";

import styles from "../styles/profile-wallet-layout";

import locale from "../locales/pt-BR";

export default class ProfileWalletLayout extends Component {
  static propTypes = {
    hasError: PropTypes.bool,
    isCreatingWallet: PropTypes.bool,
    revalidateProfileSignPlip: PropTypes.bool, // Navigation injected
    onCreateWallet: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
  }

  onCreateWallet = () => {
    const { revalidateProfileSignPlip, onCreateWallet } = this.props;

    onCreateWallet({ revalidateProfileSignPlip });
  }

  render() {
    const {
      revalidateProfileSignPlip,
      hasError,
      isCreatingWallet,
      onRetry,
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView style={{flex: 1}}>
            {this.renderNavBar()}

            {
              hasError &&
                <View style={styles.retryContainer}>
                  <FlatButton
                    title={locale.retry}
                    onPress={onRetry}
                    style={styles.retryButton}
                  />
                </View>
            }

            {
              revalidateProfileSignPlip && !hasError &&
                <View style={styles.revalidateContainer}>
                  <Text style={[styles.text, styles.bold, styles.title]}>{locale.wow}</Text>
                  <Image
                    source={require("../images/search.png")}
                  />
                  <Text style={[styles.text, { marginTop: 10 }]}>{locale.weNeedAnalyseYourProfileToSign}</Text>
                  <Text style={[styles.text, styles.bold, { marginVertical: 10 }]}>{locale.pressTheButtonToValidateYourWallet}</Text>
                  <RoundedButton
                    title={locale.validate.toUpperCase()}
                    action={this.onCreateWallet}
                    buttonStyle={styles.revalidateButton}
                    titleStyle={styles.text}/>
                </View>
            }
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isCreatingWallet} />
      </SafeAreaView>
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
