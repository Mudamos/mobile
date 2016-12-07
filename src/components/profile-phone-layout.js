import React from "react";

import {
  View,
} from "react-native";

import ComponentWithKeyboardEvent from "./component-with-keyboard-event";

export default class ProfilePhoneLayout extends ComponentWithKeyboardEvent {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: "purple"}}>
      </View>
    );
  }
}
