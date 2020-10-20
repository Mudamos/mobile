import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Animated,
  Text,
  View,
} from "react-native";

import style from "../styles/navigation-bar";

class NavigationBar extends Component {
  static propTypes = {
    containerStyle: PropTypes.any,
    leftView: PropTypes.node,
    middleView: PropTypes.node,
    rightView: PropTypes.node,
    title: PropTypes.string,
    titleStyle: Text.propTypes.style,
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
      titleStyle,
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
              <Text numberOfLines={1} style={[style.title, titleStyle]}>{title}</Text>
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
