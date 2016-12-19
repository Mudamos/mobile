import React, {
  Component,
} from "react";

import {
  StatusBar,
} from "react-native";


export default class StatusBarSpacer extends Component {
  static propTypes = {
    ...StatusBar.propTypes.style,
  };

  static defaultProps = {
    translucent: true,
    backgroundColor: "#20000000",
    barStyle: "light-content",
  }

  render() {

    return (
      <StatusBar
        {...this.props}
      />
    );
  }
}
