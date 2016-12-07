import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { cpfMask } from "../utils";


export default class CpfInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangeCpfText: PropTypes.func.isRequired,
  }

  state = {
    previousText: this.props.value,
  }

  render() {
    const {
      ...mdInputProps
    } = this.props;

    return (
      <MDTextInput
        {...mdInputProps}

        keyboardType="numeric"
        maxLength={14}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }

  onChangeText(text) {
    const { onChangeCpfText } = this.props;

    // Avoids user trying to type any symbol aother than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const rawText = this.cleanText(text);
    let cpf = cpfMask(rawText);

    // Maybe the user is trying to remove a char. If it ends
    // with the separator already, removes two last chars.
    if (cpf === this.state.previousText && /\.|-$/.test(this.state.previousText)) {
      cpf = cpf.slice(0, -2);
    }

    this.setState({ previousText: cpf });

    onChangeCpfText(cpf);
  }

  cleanText(text) {
    return String(text).replace(/-|\./g, "");
  }
}
