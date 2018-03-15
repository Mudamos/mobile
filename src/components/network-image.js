import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";

import { cancelablePromise } from "../utils";

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

  componentWillUnmount() {
    this.cancelPrefetch();
  }

  componentWillReceiveProps(nextProps) {
    const newUri = nextProps.source && nextProps.source.uri;

    if (!newUri && this.state.loading) {
      this.cancelPrefetch();
      return this.setState({ loading: false });
    }

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
    this.cancelPrefetch();

    this.prefetchTask = cancelablePromise(Image.prefetch(uri));
    this.prefetchTask.promise
      .then(() => this.setState({ loading: false }))
      .catch(e => {
        if (e && e.isCanceled) return;
        this.setState({ loading: false });
      });
  }

  cancelPrefetch() {
    if (this.prefetchTask) this.prefetchTask.cancel();
  }
}
