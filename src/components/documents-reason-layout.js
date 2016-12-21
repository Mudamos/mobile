import React, { Component, PropTypes } from "react";

import {
  Animated,
  Easing,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import HeaderLogo from "./header-logo";

import locale from "../locales/pt-BR";
import styles from "../styles/documents-reason";


export default class DocumentsReasonLayout extends Component {
  state = {
    slideInAnimation: new Animated.Value(0),
    slideOutAnimation: new Animated.Value(0),
    isHidding: false,
  }

  static propTypes = {
    onAcknowledge: PropTypes.func.isRequired,
  };

  componentDidMount() {
    Animated.timing(
      this.state.slideInAnimation,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.quad,
      }
    ).start();
  }

  animateOff() {
    this.setState({ isHidding: true });

    const { onAcknowledge } = this.props;

    Animated.timing(
      this.state.slideOutAnimation,
      {
        toValue: 1,
        duration: 500,
        easing: Easing.quad,
      }
    ).start(onAcknowledge);
  }

  render() {
    const { height: windowHeight } = Dimensions.get("window");
    const margins = 40;
    const height = windowHeight - margins;

    const { isHidding } = this.state;

    const slide = isHidding ?
      this.state.slideOutAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, height],
      }) :
      this.state.slideInAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
      });

    return (
      <Animated.View style={[styles.cardContainer, { height, top: slide }]}>
        <Image
          source={require("../images/header-people.png")}
          style={styles.peopleImage}
          resizeMode="cover"
        >
          <HeaderLogo style={styles.logo}/>
        </Image>

        <View style={styles.contentContainer}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              {locale.whyRequestDocumentsAlternative}
            </Text>

            <Text style={styles.text}>
              {locale.documentsReasonExplained}
            </Text>
          </ScrollView>

          <Text
            style={styles.link}
            onPress={() => { this.animateOff() }}
          >
            {locale.gotIt.toUpperCase()}
          </Text>
        </View>
      </Animated.View>
    );
  }
}
