import React, { Component } from "react";

import { View } from "react-native";

import Spinner from "react-native-spinkit";

import style from "../styles/page-loader";

class PageLoader extends Component {
  static defaultProps = {
    size: 100,
    color: "#CCCCCC",
    isVisible: true,
    type: "ThreeBounce",
    containerBackgroundColor: "rgba(0, 0, 0, .6)"
  }

  render() {
    const {
      containerBackgroundColor,
      size,
      color,
      isVisible,
      type
    } = this.props;

    if (!isVisible) return null;

    return (
      <View style={[style.container, { backgroundColor: containerBackgroundColor }]}>
        <Spinner color={color}
          isVisible={isVisible}
          type={type}
          size={size}/>
      </View>
    );
  }
}

export default PageLoader;
