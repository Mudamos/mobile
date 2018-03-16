import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Image,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";

import FIcon from "react-native-vector-icons/FontAwesome";

import styles from "../styles/you-tube";

export default class YouTube extends Component {
  static contextTypes = {
    navigate: PropTypes.func.isRequired,
  };

  static propTypes = {
    style: ViewPropTypes.style,
    videoId: PropTypes.string.isRequired,
  };

  get thumb() {
    const { videoId } = this.props;
    return "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg";
  }

  render() {
    const { videoId, style } = this.props;
    const { navigate } = this.context;

    return (
      <TouchableOpacity onPress={() => navigate("showVideo", { videoId })} style={[styles.container, style]}>
        <Image style={styles.thumb} source={{ uri: this.thumb }}/>

        <View style={styles.thumbOverlay}>
          <View style={styles.bigPlayButton}>
            <FIcon name="play" style={styles.playIcon} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
