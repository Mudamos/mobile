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

import { isNotNil } from "../utils";

export default class AboutAppLayout extends Component {
  static propTypes = {
    localFeedback: PropTypes.object,
    remoteLinks: RemoteLinksType,
    onBack: PropTypes.func.isRequired,
    onLogEvent: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSetFeedback: PropTypes.func.isRequired,
  }

  onGoToMudamosSite = () => {
    const { remoteLinks, onLogEvent, onOpenURL } = this.props;

    onLogEvent({ name: "go_to_mudamos_site" });
    onOpenURL(remoteLinks.getToKnowMudamos);
  }

  onLogFeedback = ({ index, answer }) => {
    const { onLogEvent, onSetFeedback } = this.props;
    onLogEvent({ name: `about_app_${index}_${answer}` });
    onSetFeedback({ questionAnswered: index, answer });
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

  renderAccordionHeader = (section, index, isActive) => {
    const direction = isActive ? "up" : "down";
    return (
      <View style={styles.accordionHeaderContainer}>
        <Text style={styles.accordionHeaderText}>{section.title}</Text>
        <ChevronButton style={styles.accordionHeaderChevron} clickable={false} direction={direction} color="#000"/>
      </View>
    );
  }

  renderAccordionContent = (section, index) => {
    const { localFeedback } = this.props;
    const gaveFeedback = localFeedback && isNotNil(localFeedback[index]);

    return (
      <View style={styles.accordionContentContainer}>
        <Text style={styles.accordionContentText}>{section.content}</Text>
        { gaveFeedback ?
            <View style={styles.classifyQuestionView}>
              <Text style={styles.thanksForFeedback}>{locale.thanksForFeedback}</Text>
            </View>
          :
            <View style={styles.classifyQuestionView}>
              <Text style={[styles.accordionContentText, styles.accordionContentTextFooter]}>{locale.thisInfoWasUseful}</Text>
              <View style={styles.buttonPanel}>
                <RoundedButton title={locale.yes} action={() => this.onLogFeedback({ index, answer: "yes" })} buttonStyle={styles.classifyQuestionButton} titleStyle={styles.classifyQuestionButtonTitle}/>
                <RoundedButton title={locale.no} action={() => this.onLogFeedback({ index, answer: "no" })} buttonStyle={styles.classifyQuestionButton} titleStyle={styles.classifyQuestionButtonTitle}/>
              </View>
            </View>
        }
      </View>
    );
  }

  renderContent() {
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
