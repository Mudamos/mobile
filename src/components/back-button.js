import React, { Component, PropTypes } from "react";

import { Text } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

export default class BackButton extends Component {
  static propTypes = {
    color: PropTypes.string,
    size: PropTypes.number,

    ...Text.propTypes,
  }

  static defaultProps = {
    color: "#fff",
    size: 20,
  }

  render() {
    const {
      color,
      size,

      ...textProps
    } = this.props;

    return (
      <Icon
        name="arrow-back"
        size={size}
        color={color}

        {...textProps}
      />
    );
  }
}
