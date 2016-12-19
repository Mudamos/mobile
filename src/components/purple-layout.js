import React, { Component, PropTypes } from "react";

import Layout from "./layout";

import LinearGradient from "react-native-linear-gradient";

import styles from "../styles/purple-layout";


export default class PurpleLayout extends Component {
  static propTypes = {
    children: PropTypes.node,
    contentStyle: PropTypes.object,
    style: PropTypes.object,
  };

  render() {
    const {
      contentStyle,
      style,
    } = this.props;

    return (
      <Layout
        style={style}
        contentStyle={contentStyle}
      >
        <LinearGradient
          start={[0.0, 0.25]}
          end={[0.7, 1.0]}
          locations={[0,1.5,2.0]}
          style={styles.gradientContainer}
          colors={["#7E52D8", "#9427DB", "#9526DB"]}
        >
          {this.props.children}
        </LinearGradient>
      </Layout>
    );
  }
}
