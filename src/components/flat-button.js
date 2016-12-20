import React, { Component, PropTypes } from "react";

import { merge } from "ramda";

import { MKButton } from "react-native-material-kit";

const textStyle = {
  fontFamily: "roboto",
  fontSize: 14,
  color: "#595959",
  fontWeight: "bold",
};


export default class MyFlatButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    ...MKButton.propTypes,
  }

  static defaultProps = {
    enabled: true,
    style: {},
  }

  render() {
    return this.renderButton();
  }

  renderButton() {
    const { title } = this.props;

    const Button = this.buttonClass()
      .withText(title)
      .build();

    return <Button />;
  }

  buttonClass() {
    const {
      enabled,
      onPress,
      style,
    } = this.props;

    const button = MKButton.flatButton()
      .withBackgroundColor("#fff")
      .withMaskBorderRadius(100)
      .withStyle(merge({ borderRadius: 100, height: 42, overflow: "hidden" }, style))
      .withTextStyle(textStyle);

    if (enabled) {
      button.withOnPress(onPress);
    } else {
      button.withRippleColor("transparent")
        .withMaskEnabled(false)
        .withMaskColor("transparent")
        .withTextStyle({ ...textStyle, opacity: 0.5 });
    }

    return button;
  }
}
