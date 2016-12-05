import React, { Component, PropTypes } from "react";

import { Text } from "react-native";

import { merge } from "ramda";

import { MKButton } from "react-native-material-kit";

const textStyle = {
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
    return this.button();
  }

  button() {
    const {
      enabled,
      title,
      onPress,
      style,
    } = this.props;

    const button = MKButton.flatButton()
      .withOnPress(onPress)
      .withBackgroundColor("#fff")
      .withMaskBorderRadius(100)
      .withStyle(merge({ borderRadius: 100 }, style))
      .withTextStyle(textStyle);

    if (!enabled) {
      button.withRippleColor("transparent")
        .withMaskEnabled(false)
        .withMaskColor("transparent")
        .withTextStyle({ ...textStyle, opacity: 0.5 });
    }

    const Button = button
      .withText(title)
      .build();

    return <Button />
  }
}
