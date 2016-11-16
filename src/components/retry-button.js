import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
  TouchableOpacity
} from "react-native";

class RetryButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    children: PropTypes.node
  }

  render() {
    const {
      onPress,
      children
    } = this.props;

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={onPress}>
          {children}
        </TouchableOpacity>
      </View>
    );
  }
}

export default RetryButton;

