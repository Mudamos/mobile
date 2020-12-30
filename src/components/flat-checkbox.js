import PropTypes from "prop-types";
import React, { Component } from "react";
import { Keyboard } from "react-native";

import { MKCheckbox } from "react-native-material-kit";

export default class MyCheckbox extends Component {
  static propTypes = {
    dismissKeyboardOnPress: PropTypes.bool,
    ...MKCheckbox.propTypes,
  };

  static defaultProps = {
    dismissKeyboardOnPress: true,
    editable: true,
  };

  render() {
    return <MKCheckbox {...this.props} onPress={this.onPress.bind(this)} />;
  }

  onPress() {
    const { dismissKeyboardOnPress, onPress } = this.props;

    if (dismissKeyboardOnPress) Keyboard.dismiss();
    if (onPress) onPress();
  }
}
