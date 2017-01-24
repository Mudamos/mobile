import React, { Component, PropTypes } from "react";

import { View } from "react-native";

import Spinner from "react-native-spinkit";

import style from "../styles/page-loader";

class PageLoader extends Component {
  static propTypes = {
    color: PropTypes.string,
    containerBackgroundColor: PropTypes.string,
    isVisible: PropTypes.bool,
    size: PropTypes.number,
    type: PropTypes.string,
  }

  static defaultProps = {
    color: "#FFFFFF",
    containerBackgroundColor: "rgba(0, 0, 0, .6)",
    isVisible: false,
    size: 70,
    type: "9CubeGrid",
  }

  render() {
    const {
      containerBackgroundColor,
      size,
      color,
      isVisible,
      type,
    } = this.props;

    if (!isVisible) return (<View/>);

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
