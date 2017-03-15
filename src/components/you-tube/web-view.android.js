import React, { Component } from "react";

import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  WebView,
} from "react-native";

const RCTYouTubeWebView = requireNativeComponent("RCTYouTubeWebView");

export default class YouTubeWebView extends Component {
  static propTypes = {
    ...WebView.propTypes,
  }

  get webViewHandle() {
    return findNodeHandle(this.webView);
  }

  render() {
    return (
      <RCTYouTubeWebView
        ref={ref => this.webView = ref}

        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        contentInset={true}
        automaticallyAdjustContentInsets={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}

        {...this.props}
      />
    );
  }

  reload() {
    UIManager.dispatchViewManagerCommand(
      this.webViewHandle,
      UIManager.RCTYouTubeWebView.Commands.reload,
      null,
    );
  }
}
