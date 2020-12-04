import PropTypes from "prop-types";
import React, { Component } from "react";
import { Keyboard } from "react-native";

import { MKButton } from "react-native-material-kit";

export const textStyle = {
  fontFamily: "roboto",
  fontSize: 14,
  color: "#595959",
  fontWeight: "bold",
};

export const buttonStyle = {
  backgroundColor: "#fff",
  borderRadius: 100,
  height: 42,
};

export default class MyFlatButton extends Component {
  static propTypes = {
    dismissKeyboardOnPress: PropTypes.bool,
    style: PropTypes.object,
    textStyle: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    ...MKButton.propTypes,
  };

  static defaultProps = {
    dismissKeyboardOnPress: true,
    enabled: true,
    textStyle: {},
    style: {},
  };

  render() {
    return this.renderButton();
  }

  renderButton() {
    const Button = this.buttonClass().build();

    return <Button>{this.props.children}</Button>;
  }

  buttonClass() {
    const { enabled, style, title } = this.props;

    const mergedStyle = { ...buttonStyle, ...style };

    const button = MKButton.flatButton()
      .withBackgroundColor(mergedStyle.backgroundColor)
      .withMaskBorderRadius(mergedStyle.borderRadius)
      .withStyle(mergedStyle)
      .withTextStyle({ ...textStyle, ...this.props.textStyle });

    if (title) {
      button.withText(title);
    }

    if (enabled) {
      button.withOnPress(this.onPress).withRippleColor("transparent"); // Disabling ripple effect as it does not work on android
    } else {
      button
        .withRippleColor("transparent")
        .withMaskEnabled(false)
        .withMaskColor("transparent")
        .withTextStyle({ ...textStyle, ...this.props.textStyle, opacity: 0.5 });
    }

    return button;
  }

  onPress = () => {
    const { dismissKeyboardOnPress, onPress } = this.props;

    if (dismissKeyboardOnPress) Keyboard.dismiss();
    onPress();
  };
}
