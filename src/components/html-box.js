import React, { Component, PropTypes }  from "react";

import {
  View
} from "react-native";

import HTML from "react-native-fence-html";


class HTMLBox extends Component {
  static propTypes ={
    html: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  render() {
    const { html, style } = this.props;

    return (
      <View style={{flex: 1}}>
        <HTML
          html={html}
          htmlStyles={style}
        />
      </View>
    );
  }
}

export default HTMLBox;
