import React, { Component, PropTypes } from "react";

import MDTextInput from "./md-text-input";

import { voteCardMask } from "../utils";


export default class VoteCardInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChangeVoteCardText: PropTypes.func.isRequired,
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
    const { onChangeVoteCardText } = this.props;

    // Avoids user trying to type any symbol aother than number
    // when there is already a separator
    if (/\D{2}$/.test(text)) return;

    const rawText = this.cleanText(text);
    let voteCard = voteCardMask(rawText);

    // Maybe the user is trying to remove a char. If it ends
    // with the separator already, removes two last chars.
    if (voteCard === this.state.previousText && this.state.previousText.endsWith(".")) {
      voteCard = voteCard.slice(0, -2);
    }

    this.setState({ previousText: voteCard });

    onChangeVoteCardText(voteCard);
  }

  cleanText(text) {
    return String(text).replace(/\./g, "");
  }
}
