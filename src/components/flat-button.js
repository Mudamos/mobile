import React, { Component, PropTypes } from "react";

import { MKButton } from "react-native-material-kit";

export const textStyle = {
  fontFamily: "roboto",
  fontSize: 14,
  color: "#595959",
  fontWeight: "bold",
};

export const buttonStyle = {
  borderRadius: 100,
  height: 42,
};


export default class MyFlatButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    textStyle: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    ...MKButton.propTypes,
  }

  static defaultProps = {
    enabled: true,
    textStyle: {},
    style: {},
  }

  render() {
    return this.renderButton();
  }

  renderButton() {
    const Button = this.buttonClass().build();

    return <Button>{this.props.children}</Button>;
  }

  buttonClass() {
    const {
      enabled,
      onPress,
      style,
      title,
    } = this.props;

    const button = MKButton.flatButton()
      .withBackgroundColor("#fff")
      .withMaskBorderRadius(100)
      .withStyle({ ...buttonStyle, ...style })
      .withTextStyle({ ...textStyle, ...this.props.textStyle });

    if (title) {
      button.withText(title);
    }

    if (enabled) {
      button.withOnPress(onPress);
    } else {
      button.withRippleColor("transparent")
        .withMaskEnabled(false)
        .withMaskColor("transparent")
        .withTextStyle({ ...textStyle, ...this.props.textStyle, opacity: 0.5 });
    }

    return button;
  }
}
