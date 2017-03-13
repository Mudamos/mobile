import React, { Component, PropTypes } from "react";

import {
  View,
  WebView,
} from "react-native";

export default class YouTubeWebView extends Component {
  static propTypes = {
    ...WebView.propTypes,
  }

  render() {
    const { style } = this.props;

    return (
      <View style={[style, { backgroundColor: "purple" }]}>
      </View>
    );
  }
}
