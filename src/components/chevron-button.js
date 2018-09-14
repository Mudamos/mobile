import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";

export default class ChevronButton extends Component {
  static propTypes = {
    clickable: PropTypes.bool,
    color: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    direction: PropTypes.string.isRequired,
    size: PropTypes.number,

    ...Text.propTypes,
  }

  static defaultProps = {
    clickable: true,
    color: "#fff",
    size: 30,
  }

  render() {
    const {
      color,
      direction,
      size,
      onPress,
      containerStyle,
      clickable,

      ...textProps
    } = this.props;

    const iconName = `chevron-${direction}`;

    const icon = (
      <Icon
        name={iconName}
        size={size}
        color={color}

        {...textProps}
      />
    );

    const iconWithTouch = (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        {icon}
      </TouchableOpacity>
    );

    return clickable ? iconWithTouch : icon;
  }
}
