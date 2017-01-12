import React, { Component, PropTypes } from "react";
import { Animated, ActivityIndicator } from "react-native";

import styles from "../styles/network-image";

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
      <ActivityIndicator style={styles.loader} color={this.props.loaderColor} />
    );
  }

  render() {
    return (
      <Animated.Image
        {...this.props}
        onLoadStart={() => this.setState({ loading: true })}
        onError={() => this.setState({ loading: false })}
        onLoad={() => this.setState({ loading: false })}>
        {this.props.children}
        {this.renderLoading()}
      </Animated.Image>
    );
  }
}
