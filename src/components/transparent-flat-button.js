import React from "react";

import FlatButton, { textStyle, buttonStyle } from "./flat-button";

export default class TransparentFlatButton extends FlatButton {
  renderButton() {
    const { enabled, style } = this.props;

    const button = this.buttonClass()
      .withBackgroundColor("transparent")
      .withStyle({
        ...buttonStyle,
        backgroundColor: "transparent",
        borderColor: "#fff",
        borderWidth: 1,
        ...style,
      })
      .withTextStyle({ ...textStyle, color: "#fff", ...this.props.textStyle });

    if (!enabled) {
      button.withTextStyle({
        ...textStyle,
        ...this.props.textStyle,
        opacity: 0.5,
      });
    }

    const Button = button.build();

    return <Button>{this.props.children}</Button>;
  }
}
