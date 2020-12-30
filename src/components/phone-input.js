import PropTypes from "prop-types";
import React, { Component } from "react";

import MDTextInput from "./md-text-input";

import { phoneMask } from "../utils";

export default class PhoneInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangePhoneText: PropTypes.func.isRequired,
  };

  render() {
    const { value, ...mdInputProps } = this.props;

    return (
      <MDTextInput
        {...mdInputProps}
        ref={(ref) => (this.input = ref)}
        value={this.removeLastSeparator(value)}
        keyboardType="numeric"
        maxLength={15}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }

  onChangeText(text) {
    const { onChangePhoneText } = this.props;

    const phone = this.removeLastSeparator(text);

    onChangePhoneText(phone);
  }

  cleanText(text) {
    return String(text || "").replace(/-|\(|\)|\s/g, "");
  }

  removeLastSeparator(text) {
    return phoneMask(this.cleanText(text))
      .replace(/\($/, "")
      .replace(/\)\s$/, "")
      .replace(/-$/, "");
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }
}
