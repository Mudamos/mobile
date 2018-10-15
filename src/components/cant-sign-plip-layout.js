import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import SafeAreaView from "./safe-area-view";
import NavigationBar from "./navigation-bar";
import Layout from "./purple-layout";
import RoundedButton from "./rounded-button";
import HeaderLogo from "./header-logo";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChevronButton from "./chevron-button";

import styles from "../styles/cant-sign-plip-layout"

import locale from "../locales/pt-BR";

import {
  plipRegion,
} from "../utils";

export default class CantSignPlipLayout extends Component {
  static propTypes = {
    plip: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onMyLocation: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  }

  onShare = () => {
    const { plip, onShare } = this.props;
    onShare(plip);
  }

  render() {
    const { plip, onMyLocation } = this.props;
    const region = plip && plipRegion(plip);

    if (!plip) return null;

    return (
      <SafeAreaView>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <View style={styles.container}>
              <Text style={[styles.text, styles.title]}>{locale.itsNotPossibleToSignThatPl}</Text>
              <Image
                source={require("../images/erro.png")}
              />
              <Text style={[styles.text, styles.small]}>{locale.wrongRegionThanks}</Text>
              <Text style={[styles.text, styles.bold]}>{locale.helpPl({ plName: plip.title, region })}</Text>
              <Text style={[styles.text, styles.small]}>{locale.knowSomeoneToShare}
              <Text style={[styles.text, styles.bold, styles.small]}>{locale.clickOnIconAndShare}</Text></Text>
              <TouchableOpacity onPress={this.onShare}>
                <Icon
                  color="#FFF"
                  name="share-variant"
                  size={68}
                  style={{marginVertical: 17}}
                />
              </TouchableOpacity>
              {this.renderLineSeparator()}
              <Image
                source={require("../images/gradient-clipboard.png")}
                style={{marginVertical: 17}}
              />
              <Text style={[styles.text, styles.bold]}>{locale.signPlipAtYourRegion}</Text>
              <Text style={[styles.text, { margin: 20 }]}>{locale.backToMainPageToSignAndShareNationalPlipOrFromYourRegion}</Text>
              <RoundedButton title={locale.showMe} action={onMyLocation} buttonStyle={styles.buttonStyle} titleStyle={{color: "#FFF"}}/>
            </View>
          </ScrollView>
        </Layout>
      </SafeAreaView>
    );
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

  renderLineSeparator() {
    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
      </View>
    );
  }
}