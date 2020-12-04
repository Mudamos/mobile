import React, { Component } from "react";

import PropTypes from "prop-types";

import { View, ViewPropTypes } from "react-native";

import StatusBarSpacer from "./status-bar-spacer";

import styles from "../styles/layout";

class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    contentStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <StatusBarSpacer />
        <View style={[styles.content, this.props.contentStyle]}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

export default Layout;
