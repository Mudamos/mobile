import React, { Component, PropTypes } from "react";

import { View } from "react-native";

import Spinner from "react-native-spinkit";

import styles from "../styles/page-loader";

class PageLoader extends Component {
  static propTypes = {
    afterChildren: PropTypes.node,
    beforeChildren: PropTypes.node,
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
        {this.props.beforeChildren}
        <Spinner color={color}
          isVisible={isVisible}
          type={type}
          size={size}/>
        {this.props.afterChildren}
      </View>
    );
  }
}

export default PageLoader;
