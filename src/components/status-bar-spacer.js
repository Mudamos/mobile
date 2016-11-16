import React, {
  Component,
  PropTypes,
} from "react";

import {
  StyleSheet,
  View,
} from "react-native";

import styles from "../styles/status-bar-spacer";

export default class StatusBarSpacer extends Component {
  static propTypes = {
    style: PropTypes.instanceOf(StyleSheet),
    transparent: PropTypes.bool,
  };

  render() {
    const colorStyle = this.props.transparent ? styles.transparent : styles.color;

    return (
      <View style={[colorStyle, this.props.style, styles.spacer]}></View>
    );
  }
}
