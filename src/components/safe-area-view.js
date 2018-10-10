import PropTypes from "prop-types";
import React from "react";

import {
  SafeAreaView,
  View,
  ViewPropTypes,
} from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

import {
  isIOSVersionBellow11,
} from "../utils";

const styles = EStyleSheet.create({
  extraPadding: {
    paddingTop: 20,
    backgroundColor: "#6000AA",
  },
});

const SafeArea = ({ children, style }) => isIOSVersionBellow11 ? (
    <View style={[styles.extraPadding, style]}>
      {children}
    </View>
  ) : (
    <SafeAreaView style={style}>
      {children}
    </SafeAreaView>
  );

SafeArea.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
}

export default SafeArea;