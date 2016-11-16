import React, { Component, PropTypes } from "react";

import {
  Text,
  View
} from "react-native";

import style from "../styles/navigation-bar";

class NavigationBar extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  render() {
    const {
      title
    } = this.props;

    return (
      <View style={style.container}>
        <View style={style.bar} >
          <View style={style.middle}>
            <Text numberOfLines={1} style={style.title}>{title}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default NavigationBar;
