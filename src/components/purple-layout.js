import PropTypes from "prop-types";
import React, { Component } from "react";

import { ViewPropTypes } from "react-native";

import Layout from "./layout";

export default class PurpleLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    contentStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
  };

  render() {
    const {
      contentStyle,
      style,
    } = this.props;

    return (
      <Layout
        style={[{flex: 1, backgroundColor: "#6000AA"}, style]}
      >
        {this.props.children}
      </Layout>
    );
  }
}
