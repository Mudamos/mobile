import React, { Component, PropTypes } from "react";
import {
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";

import styles from "../styles/network-image";

export default class NetworkImage extends Component {
  static propTypes = {
    children: PropTypes.node,
    loaderColor: PropTypes.string,

    ...Image.propStyles,
  };

  static defaultProps = {
    loaderColor: "black",
  };

  state = {
    loading: false,
  };

  componentWillMount() {
    const { source } = this.props;

    if (source && source.uri) {
      this.prefetch(source.uri);
    }
  }

  componentWillReceiveProps(nextProps) {
    const newUri = nextProps.source && nextProps.source.uri;

    if (!newUri && this.state.loading) return this.setState({ loading: false });

    const oldUri = this.props.source && this.props.source.uri;

    if (newUri !== oldUri) {
      this.prefetch(newUri);
    }
  }

  renderLoading() {
    const { loaderColor, style } = this.props;

    return (
      <Animated.View style={[style]}>
        <ActivityIndicator style={styles.loader} color={loaderColor} />
      </Animated.View>
    );
  }

  render() {
    if (this.state.loading) return this.renderLoading();

    return (
      <Animated.Image
        {...this.props}
      >
        {this.props.children}
      </Animated.Image>
    );
  }

  prefetch(uri) {
    this.setState({ loading: true });
    this.prefetchTask = Image.prefetch(uri)
      .then(() => this.setState({ loading: false }))
      .catch(() => this.setState({ loading: false }));
  }
}
