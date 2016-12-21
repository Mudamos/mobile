import React, { Component, PropTypes } from "react";

import {
  Animated,
  Easing,
  Dimensions,
  Image,
  ScrollView,
  View,
} from "react-native";

import HeaderLogo from "./header-logo";

import styles from "../styles/modal";

const ANIMATION_DURATION = 500;


export default class Modal extends Component {
  state = {
    slideInAnimation: new Animated.Value(0),
    slideOutAnimation: new Animated.Value(0),
    isHidding: false,
  }

  static propTypes = {
    children: PropTypes.node,
  }

  componentDidMount() {
    Animated.timing(
      this.state.slideInAnimation,
      {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.quad,
      }
    ).start();
  }

  hideAnimated(done) {
    this.setState({ isHidding: true });

    Animated.timing(
      this.state.slideOutAnimation,
      {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.quad,
      }
    ).start(done);
  }

  render() {
    const { height: windowHeight } = Dimensions.get("window");
    const margins = 40;
    const height = windowHeight - margins;

    const { isHidding } = this.state;

    const slide = isHidding ?
      this.state.slideOutAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, windowHeight],
      }) :
      this.state.slideInAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight, 0],
      });

    return (
      <Animated.View style={[styles.container, { height, top: slide }]}>
        <Image
          source={require("../images/header-people.png")}
          style={styles.peopleImage}
          resizeMode="cover"
        >
          <HeaderLogo style={styles.logo}/>
        </Image>

        <View style={styles.contentContainer}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {this.props.children}
          </ScrollView>

          {this.renderFooter()}
        </View>
      </Animated.View>
    );
  }

  renderFooter() {
    return <View />;
  }
}
