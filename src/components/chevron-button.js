import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default class BackButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    size: PropTypes.number,

    ...Text.propTypes,
  }

  static defaultProps = {
    color: "#fff",
    size: 30,
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
          name="chevron-left"
          size={size}
          color={color}

          {...textProps}
        />
      </TouchableOpacity>
    );
  }
}
