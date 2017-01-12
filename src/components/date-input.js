import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { dateMask } from "../utils";


export default class DateInput extends Component {
  static propTypes = {
    separator: PropTypes.oneOf(["/", "-"]),
    value: PropTypes.string,
    onChangeDateText: PropTypes.func.isRequired,
  }

  static defaultProps = {
    separator: "/",
    keyboardType: "numeric",
    returnKeyType: "send",
  }

  get separatorRegex() {
    return new RegExp(this.props.separator, "g");
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
        maxLength={10}
        onChangeText={this.onChangeText.bind(this)} />
    );
  }

  onChangeText(text) {
    const { onChangeDateText } = this.props;

    // Avoids user trying to type any symbol other than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const date = this.removeLastSeparator(text);

    onChangeDateText(date);
  }

  cleanText(text) {
    return String(text || "").replace(this.separatorRegex, "");
  }

  removeLastSeparator(text) {
    return dateMask(this.cleanText(text))
      .replace(/-$/, "")
      .replace(/\/$/, "");
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }
}
