import PropTypes from "prop-types";
import React, { Component } from "react";

import { Animated, StyleSheet } from "react-native";

const style = StyleSheet.create({
  image: {
    alignSelf: "center",
  },
});

export default class HeaderLogo extends Component {
  static propTypes = {
    imgStyle: PropTypes.any,
  }

  setNativeProps(nativeProps) {
    this.image.setNativeProps(nativeProps);
  }

  render() {
    const { imgStyle } = this.props;

    return (
      <Animated.Image
        ref={ref => this.image = ref}
        source={require("../images/Logo.png")}
        style={[style.image, imgStyle]}
      />
    );
  }
}
