import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { zipCodeMask } from "../utils";


export default class ZipCodeInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangeZipCodeText: PropTypes.func.isRequired,
  }

  render() {
    const {
      value,
      ...mdInputProps
    } = this.props;

    return (
      <MDTextInput
        {...mdInputProps}

        ref={ref => this.input = ref}
        value={this.removeLastSeparator(value)}
        keyboardType="numeric"
        maxLength={9}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }

  onChangeText(text) {
    const { onChangeZipCodeText } = this.props;

    // Avoids user trying to type any symbol other than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const zipCode = this.removeLastSeparator(text);

    onChangeZipCodeText(zipCode);
  }

  cleanText(text) {
    return String(text || "").replace("-", "");
  }

  removeLastSeparator(text) {
    return zipCodeMask(this.cleanText(text))
      .replace(/-$/, "");
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }
}
