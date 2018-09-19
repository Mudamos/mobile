import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Button,
  ImageBackground,
  Text,
  SafeAreaView,
  View,
} from "react-native";

import styles from "../styles/send-your-pl-layout";

import Layout from "./purple-layout";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import ScrollView from "./scroll-view";
import ChevronButton from "./chevron-button";
import HeaderLogo from "./header-logo";

import locale from "../locales/pt-BR";

import { RemoteLinksType } from "../prop-types/remote-config";

export default class HelpLayout extends Component {
  static propTypes = {
    remoteLinks: RemoteLinksType,
    onBack: PropTypes.func.isRequired,
    onLogEvent: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
  }

  onGoToSendPlForm = () => {
    const { remoteLinks, onLogEvent, onOpenURL } = this.props;

    onOpenURL(remoteLinks.sendYourIdea);
  }

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
              <Text style={[styles.text, styles.title]}>{locale.sendYourPL}</Text>
              <Text style={[styles.text, styles.incredible]}>{locale.incredible}</Text>
            </View>
            <View style={styles.instructionsContainer}>
              <Text style={[styles.text, styles.bold, styles.instructions]}>{locale.youWillCreateAPl}</Text>
              <Text style={[styles.text, styles.instructions]}>{locale.createAPlInformation}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <RoundedButton title={locale.continue} action={this.onGoToSendPlForm} buttonStyle={styles.continueButton} titleStyle={[styles.text, styles.continueButtonTitle]}/>
            </View>
            <Text style={[styles.text, styles.buttonInfo]}>{locale.youWillBeRedirectToWebForm}</Text>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    );
  }
}
