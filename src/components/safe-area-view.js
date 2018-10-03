import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Platform,
  SafeAreaView,
  View,
  ViewPropTypes,
} from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  extraPadding: {
    paddingTop: 20,
  }
});

export default class SafeArea extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
  };

  isIOSVersionBellow11 = () => {
    const majorVersionIOS = parseInt(Platform.Version, 10);
    return Platform.OS === "ios" && majorVersionIOS <= 11;
  }

  render() {
    const {
      style,
    } = this.props;

    const customStyle = this.isIOSVersionBellow11 ? styles.extraPadding : {}

    if (this.isIOSVersionBellow11) {
      return (
        <View style={[styles.extraPadding, style]}>
          {this.props.children}
        </View>
      );
    } else {
      return (
        <SafeAreaView style={style}>
          {this.props.children}
        </SafeAreaView>
      );
    }
  }
}