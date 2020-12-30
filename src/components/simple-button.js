import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewPropTypes,
} from "react-native";

import { isString } from "../utils";

export default class SimpleButton extends Component {
  static propTypes = {
    buttonStyle: ViewPropTypes.style,
    children: PropTypes.node,
    containerStyle: ViewPropTypes.style,
    disabled: PropTypes.bool.isRequired,
    textStyle: Text.propTypes.style,

    onPress: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
  };

  render() {
    const {
      children,
      disabled,
      buttonStyle,
      textStyle,
      containerStyle,
      onPress,
    } = this.props;

    const text = isString(children) ? (
      <Text style={[defaultStyle.textStyle, textStyle]}>{children}</Text>
    ) : (
      children
    );

    const content = disabled ? (
      <View style={defaultStyle.disabledContentStyle}>{text}</View>
    ) : (
      text
    );

    const button = (
      <View style={[defaultStyle.buttonStyle, buttonStyle]}>{content}</View>
    );

    const touchableButton = disabled ? (
      <View style={[defaultStyle.containerStyle, containerStyle]}>
        {button}
      </View>
    ) : (
      <TouchableHighlight
        style={[defaultStyle.containerStyle, containerStyle]}
        onPress={(e) => !disabled && onPress(e)}>
        {button}
      </TouchableHighlight>
    );

    return touchableButton;
  }
}

const defaultStyle = StyleSheet.create({
  disabledContentStyle: {
    opacity: 0.5,
  },
  textStyle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonStyle: {
    borderRadius: 3,
    borderColor: "transparent",
    backgroundColor: "purple",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  containerStyle: {
    backgroundColor: "transparent",
    borderRadius: 3,
    borderColor: "transparent",
  },
});
