import React, { Component, PropTypes } from "react";

import { clamp } from "ramda";

import {
  Text,
  View,
} from "react-native";

import { facebookPicURI } from "../utils";

import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import styles from "../styles/signer-bubble-view";


export default class SignerBubbleView extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    style: View.propTypes.style,
    total: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
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
        {profiles.map(user => this.renderHead(user))}
        {this.renderExceeding()}
      </View>
    );
  }

  renderHead(user) {
    return (
      <NetworkImage
        key={`bubble-head-${user.id}`}
        source={{uri: facebookPicURI({ id: user.id, type: "normal" })}}
        style={styles.bubble}
      />
    );
  }

  renderExceeding() {
    const exceeding = this.exceedingTotal;

    if (!exceeding) return null;

    return (
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
  }
}
