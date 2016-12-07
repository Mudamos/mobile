import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { cpfMask } from "../utils";


export default class CpfInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangeCpfText: PropTypes.func.isRequired,
  }

  render() {
    const {
      value,
      ...mdInputProps
    } = this.props;

    return (
      <MDTextInput
        {...mdInputProps}

        value={this.removeLastSeparator(value)}
        keyboardType="numeric"
        maxLength={14}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }

  onChangeText(text) {
    const { onChangeCpfText } = this.props;

    // Avoids user trying to type any symbol other than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const cpf = this.removeLastSeparator(text);

    onChangeCpfText(cpf);
  }

  cleanText(text) {
    return String(text || "").replace(/-|\./g, "");
  }

  removeLastSeparator(text) {
    return cpfMask(this.cleanText(text))
      .replace(/\.$/, "")
      .replace(/-$/,"")
  }
}
