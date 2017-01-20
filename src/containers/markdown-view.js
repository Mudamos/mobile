import React, { Component, PropTypes }  from "react";

import { View, Text } from "react-native";

import { connect } from "react-redux";

import { deepMerge } from "../utils";

import marked from "marked";

import HTMLBox from "../components/html-box";

import defaultHtmlStyles from "../styles/default-html-styles";


const defaultProps = {
  content: "",
  contentContainerStyle: defaultHtmlStyles,
  renderers: {
    blockquote: (attributes, children, passProps) => {
      const Blockquote = (
        <View style={passProps.htmlStyles.blockquote}>
          <Text>
            {children}
          </Text>
        </View>
      );

      return Blockquote;
    },
  },
};


class MarkdownView extends Component {
  static propTypes = {
    content: PropTypes.string,
    contentContainerStyle: PropTypes.object,
    renderers: PropTypes.object,
  }

  render() {
    const props = deepMerge(defaultProps, this.props);
    const html = marked(props.content);
    const { renderers, contentContainerStyle } = props;

    return (
      <HTMLBox
        html={html}
        renderers={renderers}
        style={contentContainerStyle}/>
    );
  }
}

export default connect()(MarkdownView);
