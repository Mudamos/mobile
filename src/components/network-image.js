import React, { Component, PropTypes } from "react";
import { ActivityIndicator, Image, View } from "react-native";

export default class NetworkImage extends Component {
  static propTypes = {
    children: PropTypes.node,
    loaderColor: PropTypes.string,
  };

  static defaultProps = {
    loaderColor: "black",
  };

  state = {
    loading: false,
  };

  renderLoading() {
    if (!this.state.loading) return null;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={this.props.loaderColor} />
      </View>
    );
  }

  render() {
    return (
      <Image
        {...this.props}
        onLoadStart={() => this.setState({ loading: true })}
        onError={() => this.setState({ loading: false })}
        onLoad={() => this.setState({ loading: false })}>
        {this.renderLoading()}
        {this.props.children}
      </Image>
    );
  }
}
