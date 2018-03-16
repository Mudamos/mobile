import React, { Component } from "react";

import PropTypes from "prop-types";

import { clamp } from "ramda";

import {
  TouchableOpacity,
  Text,
  View,
  ViewPropTypes,
} from "react-native";

import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/signer-bubble-view";

const gradientStart = { x: 0.0, y: 0.25 };
const gradientEnd = { x: 0.7, y: 1.0 };
const gradientLocation = [0, 1.5, 2.0];
const gradientColors = ["#7E52D8", "#9427DB", "#9526DB"];

export default class SignerBubbleView extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    total: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    size: 3,
  }

  get profiles() {
    const { size, users } = this.props;
    return users.slice(0, size);
  }

  get exceedingTotal() {
    const { size, total } = this.props;
    return clamp(0, 100, total - size);
  }

  render() {
    const { style } = this.props;
    const profiles = this.profiles;

    return (
      <View style={[styles.container, style]}>
        {profiles.map(this.renderHead.bind(this))}
        {this.renderExceeding()}
      </View>
    );
  }

  renderHead(user) {
    const { onPress } = this.props;
    const image = (
      <NetworkImage
        key={`bubble-head-${user.id}`}
        source={{uri: user.pictureUrl}}
        style={styles.bubble}
      />
    );

    return onPress ?
      <TouchableOpacity
        onPress={onPress}
        key={`bubble-head-touch-${user.id}`}>
          {image}
      </TouchableOpacity> :
      image;
  }

  renderExceeding() {
    const { onPress } = this.props;
    const exceeding = this.exceedingTotal;

    if (!exceeding) return null;

    const bubble = (
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        locations={gradientLocation}
        style={styles.bubbleGradient}
        colors={gradientColors}
      >
        <Text style={styles.exceeding}>
          +{exceeding}
        </Text>
      </LinearGradient>
    );

    return onPress ?
      <TouchableOpacity onPress={onPress}>{bubble}</TouchableOpacity> :
      bubble;
  }
}
