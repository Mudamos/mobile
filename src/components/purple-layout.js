import PropTypes from "prop-types";
import React, { Component } from "react";

import { StyleSheet, ViewPropTypes } from "react-native";

import Layout from "./layout";

const styles = StyleSheet.create({
  purple: {
    flex: 1,
    backgroundColor: "#6000AA",
  },
});

export default class PurpleLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
  };

  render() {
    const { style } = this.props;

    return (
      <Layout style={[styles.purple, style]}>{this.props.children}</Layout>
    );
  }
}
