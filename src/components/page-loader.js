import React, { Component, PropTypes } from "react";

import { View } from "react-native";

import Spinner from "react-native-spinkit";

import styles from "../styles/page-loader";

class PageLoader extends Component {
  static propTypes = {
    append: PropTypes.node,
    color: PropTypes.string,
    isVisible: PropTypes.bool,
    prepend: PropTypes.node,
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
      append,
      size,
      color,
      isVisible,
      prepend,
      style,
      type,
    } = this.props;

    if (!isVisible) return (<View/>);

    return (
      <View style={[styles.container, style]}>
        {prepend}

        <Spinner color={color}
          isVisible={isVisible}
          type={type}
          size={size}/>

        {append}
      </View>
    );
  }
}

export default PageLoader;
