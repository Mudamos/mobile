import PropTypes from "prop-types";
import React, { Component } from "react";

import { Image, Text, View } from "react-native";

import styles from "../styles/help-layout";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import ScrollView from "./scroll-view";
import ChevronButton from "./chevron-button";
import HeaderLogo from "./header-logo";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

import { RemoteLinksType } from "../prop-types/remote-config";

export default class HelpLayout extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    remoteLinks: RemoteLinksType,
    onBack: PropTypes.func.isRequired,
    onLogEvent: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
  };

  onGoToHelpForm = () => {
    const { remoteLinks, onOpenURL } = this.props;

    onOpenURL(remoteLinks.help);
  };

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        leftView={<ChevronButton onPress={onBack} direction="left" />}
        middleView={<HeaderLogo />}
      />
    );
  }

  render() {
    const { currentUser } = this.props;

    const complement = currentUser ? `, ${currentUser.name}` : "";

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          {this.renderNavBar()}
          <ScrollView style={styles.body}>
            <View style={styles.titleContainer}>
              <Text style={[styles.text, styles.title]}>
                {locale.hello({ complement })}
              </Text>
              <Text style={[styles.text, styles.title]}>
                {locale.mayIHelpYou}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image source={require("../images/sos.png")} />
            </View>
            <View style={styles.instructionsContainer}>
              <Text style={[styles.text, styles.bold, styles.instructions]}>
                {locale.wePrepareAFormForYourHelp}
              </Text>
              <Text style={[styles.text, styles.instructions]}>
                {locale.ifYouWannaProceedClickTheButtonBelow}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <RoundedButton
                title={locale.continue}
                action={this.onGoToHelpForm}
                buttonStyle={styles.continueButton}
                titleStyle={[styles.text, styles.continueButtonTitle]}
              />
            </View>
            <Text style={[styles.text, styles.buttonInfo]}>
              {locale.youWillBeRedirectToWebForm}
            </Text>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    );
  }
}
