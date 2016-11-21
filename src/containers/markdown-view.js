import React, { Component, PropTypes }  from "react";

import { connect } from "react-redux";

import marked from "marked";

import HTMLBox from "../components/html-box";

class MarkdownView extends Component {
  static propTypes = {
    content: PropTypes.string,
  }

  static defaultProps = {
    content: "",
  }

  render() {
    const html = marked(this.props.content);

    return (
      <HTMLBox html={html} />
    );
  }
}

export default connect()(MarkdownView);
