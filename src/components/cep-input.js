import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { cepMask } from "../utils";


export default class CepInput extends Component {
  state = {
    previousText: this.props.value,
  }

  static propTypes = {
    value: PropTypes.string,
    onChangeCepText: PropTypes.func.isRequired,
  }

  render() {
    const {
      ...mdInputProps
    } = this.props;

    return (
      <MDTextInput
        {...mdInputProps}

        keyboardType="numeric"
        maxLength={9}
        onChangeText={this.onChangeText.bind(this)}
      />
    );
  }

  onChangeText(text) {
    const { onChangeCepText } = this.props;

    // Avoids user trying to type any symbol aother than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const rawText = this.cleanText(text);
    let cep = cepMask(rawText);

    // Maybe the user is trying to remove a char. If it ends
    // with the separator already, removes two last chars.
    if (cep === this.state.previousText && this.state.previousText.endsWith("-")) {
      cep = cep.slice(0, -2);
    }

    this.setState({ previousText: cep });

    onChangeCepText(cep);
  }

  cleanText(text) {
    return String(text).replace("-", "");
  }
}
