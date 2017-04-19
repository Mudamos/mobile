import React, { PropTypes } from "react";

import {
  Animated,
  StyleSheet,
} from "react-native";

const Triangle = ({ color, style, ...props }) =>
  <Animated.View
    {...props}
    style={[styles.triangle, { borderBottomColor: color }, style]}
  />;

Triangle.propTypes = {
  ...Animated.View.propTypes,
  color: PropTypes.string,
};

Triangle.defaultProps = {
  color: "#883DE1",
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});

export default Triangle;
