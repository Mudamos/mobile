import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import style from "../styles/navigation-bar";

class NavigationBar extends Component {
  static propTypes = {
    leftView: PropTypes.node,
    rightView: PropTypes.node,
    title: PropTypes.string,
  }

  render() {
    const {
      title,
      leftView,
      rightView,
    } = this.props;

    return (
      <View style={style.container}>
        <View style={style.bar}>
          <View style={style.left}>
            {leftView}
          </View>
          <View style={style.middle}>
            <Text numberOfLines={1} style={style.title}>{title}</Text>
          </View>
          <View style={style.right}>
            {rightView}
          </View>
        </View>
      </View>
    );
  }
}

export default NavigationBar;
