import React, { Component, PropTypes } from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default class BackButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    containerStyle: View.propTypes.style,
    size: PropTypes.number,

    ...Text.propTypes,
  }

  static defaultProps = {
    color: "#fff",
    size: 26,
  }

  render() {
    const {
      color,
      size,
      onPress,
      containerStyle,

      ...textProps
    } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        <Icon
          name="arrow-back"
          size={size}
          color={color}

          {...textProps}
        />
      </TouchableOpacity>
    );
  }
}
