import React, { Component, PropTypes } from "react";

import {
  Animated,
  Text,
  View,
} from "react-native";

import style from "../styles/navigation-bar";

class NavigationBar extends Component {
  static propTypes = {
    containerStyle: Animated.View.propTypes.style,
    leftView: PropTypes.node,
    middleView: PropTypes.node,
    rightView: PropTypes.node,
    title: PropTypes.string,
  }

  setNativeProps(nativeProps) {
    this.container.setNativeProps(nativeProps);
  }

  render() {
    const {
      containerStyle,
      title,
      leftView,
      rightView,
      middleView,
    } = this.props;

    return (
      <Animated.View ref={ref => this.container = ref} style={[style.container, containerStyle]}>
        <View style={[style.bar]}>
          <View style={style.left}>
            {leftView}
          </View>
          <View style={style.middle}>
          {
            middleView ?
              middleView :
              <Text numberOfLines={1} style={style.title}>{title}</Text>
          }
          </View>
          <View style={style.right}>
            {rightView}
          </View>
        </View>
      </Animated.View>
    );
  }
}

export default NavigationBar;
