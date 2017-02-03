import React, { Component, PropTypes } from "react";

import { View } from "react-native";

import Spinner from "react-native-spinkit";

import styles from "../styles/page-loader";

class PageLoader extends Component {
  static propTypes = {
    children: PropTypes.node,
    color: PropTypes.string,
    isVisible: PropTypes.bool,
    size: PropTypes.number,
    style: View.propTypes.style,
    type: PropTypes.string,
  }

  static defaultProps = {
    color: "#FFFFFF",
    isVisible: false,
    size: 70,
    type: "9CubeGrid",
  }

  render() {
    const {
      size,
      color,
      isVisible,
      style,
      type,
    } = this.props;

    if (!isVisible) return (<View/>);

    return (
      <View style={[styles.container, style]}>
        <Spinner color={color}
          isVisible={isVisible}
          type={type}
          size={size}/>
        {this.props.children}
      </View>
    );
  }
}

export default PageLoader;
