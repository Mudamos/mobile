import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

class RetryButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
  }

  render() {
    const {
      onPress,
    } = this.props;

    return (
      <View style={{flex: 1, alignItems: "center" }}>
        <Icon.Button name="error" backgroundColor="#3b5998" onPress={onPress}>
          Tentar novamente
        </Icon.Button>
      </View>
    );
  }
}

export default RetryButton;

