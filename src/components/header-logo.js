import React, { Component } from "react";

import { Animated, StyleSheet } from "react-native";

const style = StyleSheet.create({
  image: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
});

export default class HeaderLogo extends Component {
  static propTypes = {
    imgStyle: Animated.Image.propTypes.style,
  }

  setNativeProps(nativeProps) {
    this.image.setNativeProps(nativeProps);
  }

  render() {
    const { imgStyle } = this.props;
    return <Animated.Image ref={ref => this.image = ref} source={require("../images/Logo.png")} style={[style.image, imgStyle]}/>
  }
}
