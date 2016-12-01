import React, { Component, PropTypes } from "react";

import TextInput from "./text-input";

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

  state = {
    previousText: this.props.value,
  }

  get separatorRegex() {
    return new RegExp(this.props.separator, "g");
  }

  render() {
    return (
      <TextInput
        {...this.props}
        maxLength={10}
        onChangeText={this.onChangeText.bind(this)} />
    );
  }

  onChangeText(text) {
    const { onChangeDateText, separator } = this.props;

    // Avoids user trying to type any symbol aother than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const rawText = this.cleanText(text);
    let date = dateMask(rawText);

    // Maybe the user is trying to remove a char. If it ends
    // with the separator already, removes two last chars.
    if (date === this.state.previousText && this.state.previousText.endsWith(separator)) {
      date = date.slice(0, -2);
    }

    this.setState({ previousText: date });

    onChangeDateText(date);
  }

  cleanText(text) {
    return String(text).replace(this.separatorRegex, "");
  }
}
