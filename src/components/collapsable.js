import PropTypes from "prop-types";
import React, { Component } from "react";

import { Animated, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

export default class Collapsable extends Component {
  static propTypes = {
    children: PropTypes.node,
    collapsed: PropTypes.bool,
  };

  state = {
    animation: new Animated.Value(0),
    firstRender: true,
  };

  close({ duration = 200 } = {}) {
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => this.setState({ collapsed: true }));
  }

  open({ duration = 200 } = {}) {
    Animated.timing(this.state.animation, {
      toValue: this.state.height,
      duration,
      useNativeDriver: true,
    }).start(() => this.setState({ collapsed: false }));
  }

  componentDidMount() {
    this.props.collapsed ? this.close() : this.open();
  }

  componentDidUpdate() {
    const shouldCollapse = this.props.collapsed;
    if (this.state.collapsed !== shouldCollapse) {
      shouldCollapse ? this.close() : this.open();
    }
  }

  render() {
    const height = this.state.firstRender ? null : this.state.animation;

    return (
      <Animated.View style={[{ height }, styles.container]}>
        <View onLayout={this.wrapperOnLayout}>{this.props.children}</View>
      </Animated.View>
    );
  }

  wrapperOnLayout = (event) => {
    if (this.state.firstRender) {
      const height = event.nativeEvent.layout.height;

      this.state.animation.setValue(height);
      this.setState({ height, firstRender: false }, () => {
        this.props.collapsed
          ? this.close({ duration: 0 })
          : this.open({ duration: 0 });
      });
    }
  };
}
