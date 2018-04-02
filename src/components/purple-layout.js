import PropTypes from "prop-types";
import React, { Component } from "react";

import { ViewPropTypes } from "react-native";

import Layout from "./layout";

import LinearGradient from "react-native-linear-gradient";

import styles from "../styles/purple-layout";

const gradientStart = { x: 0.0, y: 0.25 };
const gradientEnd = { x: 0.7, y: 1.0 };
const gradientLocation = [0, 1.5, 2.0];
const gradientColors = ["#7E52D8", "#9427DB", "#9526DB"];

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
        style={style}
      >
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          locations={gradientLocation}
          style={[styles.gradientContainer, contentStyle]}
          colors={gradientColors}
        >
          {this.props.children}
        </LinearGradient>
      </Layout>
    );
  }
}
