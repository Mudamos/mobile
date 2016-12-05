import React, { Component, PropTypes } from "react";

import { Image, StyleSheet } from "react-native";

const style = StyleSheet.create({
  image: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 26,
  }
});

export default class HeaderLogo extends Component {
  static propTypes = {
    imgStyle: PropTypes.object,
  }

  render() {
    const { imgStyle } = this.props;
    return <Image source={require("../images/Logo.png")} style={[style.image, imgStyle]}/>
  }
}
