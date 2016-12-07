import { Component } from "react";

import { Keyboard } from "react-native";

export default class ComponentWithKeyboardEvent extends Component {
  state = {
    hasKeyboard: false,
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow () {
    this.setState({ hasKeyboard: true });
  }

  keyboardDidHide () {
    this.setState({ hasKeyboard: false });
  }
}
