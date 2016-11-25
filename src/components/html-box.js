import React, { Component, PropTypes }  from "react";

import {
  View,
} from "react-native";

import HTML from "react-native-fence-html";


class HTMLBox extends Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    renderers: PropTypes.object,
    style: PropTypes.object,
  }

  static defaultProps = {
    renderers: {},
    style: {},
  }

  render() {
    const { html, style, renderers } = this.props;

    return (
      <View style={{flex: 1}}>
        <HTML
          html={html}
          htmlStyles={style}
          renderers={renderers}
        />
      </View>
    );
  }
}

export default HTMLBox;
