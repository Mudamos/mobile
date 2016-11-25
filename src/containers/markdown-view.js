import React, { Component, PropTypes }  from "react";

import { View, Text } from "react-native";

import { connect } from "react-redux";

import marked from "marked";

import HTMLBox from "../components/html-box";

class MarkdownView extends Component {
  static propTypes = {
    content: PropTypes.string,
    contentContainerStyle: PropTypes.object,
    renderers: PropTypes.object,
  }

  static defaultProps = {
    content: "",
    contentContainerStyle: {
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: "lightgray",
        paddingLeft: 10,
      },
    },
    renderers: {
      blockquote: (attributes, children, passProps) => ((
        <View style={passProps.htmlStyles.blockquote}>
          <Text>
            {children}
          </Text>
        </View>
      )),
    },
  }

  render() {
    const html = marked(this.props.content);
    const { renderers, contentContainerStyle } = this.props;

    return (
      <HTMLBox
        html={html}
        renderers={renderers}
        style={contentContainerStyle}/>
    );
  }
}

export default connect()(MarkdownView);
