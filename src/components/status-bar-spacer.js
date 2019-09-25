import PropTypes from "prop-types";
import React, {
  Component,
} from "react";

import {
  StatusBar,
} from "react-native";


export default class StatusBarSpacer extends Component {
  static propTypes = {
    animated: PropTypes.bool,
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(["default", "light-content", "dark-content"]),
    hidden: PropTypes.bool,
    networkActivityIndicatorVisible: PropTypes.bool,
    showHideTransition: PropTypes.oneOf(["fade", "slide"]),
    translucent: PropTypes.bool,
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
