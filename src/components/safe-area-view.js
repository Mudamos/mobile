import PropTypes from "prop-types";
import React from "react";

import { SafeAreaView, View, ViewPropTypes } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

import { isIOSVersionBellow11 } from "../utils";

const styles = EStyleSheet.create({
  defaultStyle: {
    flex: 1,
    backgroundColor: "#6000AA",
  },
  extraPadding: {
    paddingTop: 20,
  },
});

const SafeArea = ({ children, style }) =>
  isIOSVersionBellow11 ? (
    <View style={[styles.defaultStyle, styles.extraPadding, style]}>
      {children}
    </View>
  ) : (
    <SafeAreaView style={[styles.defaultStyle, style]}>{children}</SafeAreaView>
  );

SafeArea.propTypes = {
  children: PropTypes.node,
  style: ViewPropTypes.style,
};

export default SafeArea;
