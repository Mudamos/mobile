import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Button,
  ImageBackground,
  Text,
  SafeAreaView,
  View,
} from "react-native";

import Accordion from 'react-native-collapsible/Accordion';

import styles from "../styles/about-app-layout";

import BackButton from "./back-button";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import ScrollView from "./scroll-view";
import ChevronButton from "./chevron-button";
import HeaderLogo from "./header-logo";

import locale from "../locales/pt-BR";

import { RemoteLinksType } from "../prop-types/remote-config";

export default class AboutAppLayout extends Component {
  static propTypes = {
    remoteLinks: RemoteLinksType,
    onBack: PropTypes.func.isRequired,
    onLogEvent: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
  }

  onGoToMudamosSite = () => {
    const { remoteLinks, onLogEvent, onOpenURL } = this.props;

    onLogEvent({ name: "go_to_mudamos_site" });
    onOpenURL(remoteLinks.getToKnowMudamos);
  }

  componentDidMount() {
  }

  render() {
    const {
      onBack,
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.body}>
          {this.renderNavBar()}

          {this.renderContent()}

          {this.renderFooter()}
        </ScrollView>
      </SafeAreaView>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <View>
        <ImageBackground
          source={require("../images/header-people.png")}
          style={styles.peopleImage}
          resizeMode="cover"
        >
          <NavigationBar
            leftView={<ChevronButton onPress={onBack} direction="left" />}
            middleView={<HeaderLogo />}
          />
        </ImageBackground>
      </View>
    );
  }

  renderAccordionHeader(section, index, isActive) {
    const direction = isActive ? "up" : "down";
    return (
      <View style={styles.accordionHeaderContainer}>
        <Text style={styles.accordionHeaderText}>{section.title}</Text>
        <ChevronButton style={styles.accordionHeaderChevron} clickable={false} direction={direction} color="#000"/>
      </View>
    );
  }

  renderAccordionContent(section) {
    return (
      <View style={styles.accordionContentContainer}>
        <Text style={styles.accordionContentText}>{section.content}</Text>
        <View style={styles.classifyQuestionView}>
          <Text style={[styles.accordionContentText, { textAlign: "center" }]}>Esta informação foi útil?</Text>
          <View style={styles.buttonPanel}>
            <RoundedButton title={locale.yes} action={() => console.log("yes")} buttonStyle={styles.classifyQuestionButton} titleStyle={styles.classifyQuestionButtonTitle}/>
            <RoundedButton title={locale.no} action={() => console.log("no")} buttonStyle={styles.classifyQuestionButton} titleStyle={styles.classifyQuestionButtonTitle}/>
          </View>
        </View>
      </View>
    );
  }

  renderContent() {
    const {
    } = this.props;

    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{locale.aboutApp.title}</Text>
        </View>
        <Accordion
          sections={locale.aboutApp.sections}
          renderHeader={this.renderAccordionHeader}
          renderContent={this.renderAccordionContent}
          underlayColor="rgba(0,0,0,0.15)"
        />
      </View>
    );
  }

  renderFooter() {
    const { onGoToMudamosSite } = this.props;

    return (
      <View style={styles.footerContainer}>
        <View style={styles.moreAboutMudamos}>
          <Text style={styles.moreAboutMudamosTitle}>{locale.wannaKnowMoreAboutMudamos}</Text>
          <RoundedButton title={locale.goToSite} action={this.onGoToMudamosSite} buttonStyle={styles.goToMudamosSiteButton} titleStyle={styles.goToMudamosSiteTitle} />
          <Text style={styles.moreAboutMudamosInfo}>{locale.youWillBeRedirectToMudamos}</Text>
        </View>
      </View>
    )
  }
}
