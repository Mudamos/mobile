import React, { Component, PropTypes } from "react";

import { clamp } from "ramda";

import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/signer-bubble-view";


export default class SignerBubbleView extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    style: View.propTypes.style,
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
        start={[0.0, 0.25]}
        end={[0.7, 1.0]}
        locations={[0, 1.5, 2.0]}
        style={styles.bubbleGradient}
        colors={["#7E52D8", "#9427DB", "#9526DB"]}
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
