import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  View,
  ViewPropTypes,
  TouchableOpacity,
} from "react-native";

import NetworkImage from "./network-image";

import styles from "../styles/avatar";


export default class Avatar extends Component {
  static propTypes = {
    avatarStyle: ViewPropTypes.style,
    defaultPicture: PropTypes.any,
    size: PropTypes.number,
    source: PropTypes.object,
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaultPicture: require("../images/default-avatar.jpg"),
    size: 100,
  }

  get picture() {
    const { source, defaultPicture } = this.props;
    return source || defaultPicture;
  }

  render() {
    const {
      avatarStyle,
      size,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.container}
      >
        <NetworkImage
          source={this.picture}
          style={[styles.bubble, {
            borderRadius: size / 2,
            width: size,
            height: size,
          }, avatarStyle]}
        />
      </TouchableOpacity>
    );
  }
}
