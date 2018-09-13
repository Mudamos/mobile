import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default class ChevronButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    direction: PropTypes.string.isRequired,
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
      direction,
      size,
      onPress,
      containerStyle,

      ...textProps
    } = this.props;

    const iconName = (direction === "right") ? "chevron-right" : "chevron-left";

    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        <Icon
          name={iconName}
          size={size}
          color={color}

          {...textProps}
        />
      </TouchableOpacity>
    );
  }
}
