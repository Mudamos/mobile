import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { voteCardMask } from "../utils";


export default class VoteCardInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangeVoteCardText: PropTypes.func.isRequired,
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
    const { onChangeVoteCardText } = this.props;

    // Avoids user trying to type any symbol other than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const voteCard = this.removeLastSeparator(text);

    onChangeVoteCardText(voteCard);
  }

  cleanText(text) {
    return String(text || "").replace(/\./g, "");
  }

  removeLastSeparator(text) {
    return voteCardMask(this.cleanText(text)).replace(/\.$/, "");
  }
}
