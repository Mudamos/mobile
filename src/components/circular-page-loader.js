import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  View,
  ViewPropTypes
} from "react-native";

import Spinner from "react-native-spinkit";

import styles from "../styles/page-loader";

class PageLoader extends Component {
  static propTypes = {
    append: PropTypes.node,
    isVisible: PropTypes.bool,
    percentage: PropTypes.number,
    prepend: PropTypes.node,
    style: ViewPropTypes.style,
  }

  static defaultProps = {
    percentage: 0,
    isVisible: false,
  }

  render() {
    const {
      append,
      isVisible,
      percentage,
      prepend,
      style,
    } = this.props;

    if (!isVisible) return (<View/>);

    const progressLayerY = percentage * 2;
    const formatPercentage = parseInt(percentage);

    return (
      <View style={[styles.container, style]}>
        {prepend}

        <View style={styles.loader}>
          <View style={[styles.progressLayer, { borderBottomWidth: progressLayerY }]}/>
          <Text style={styles.progressText}>{formatPercentage} %</Text>
        </View>

        {append}
      </View>
    );
  }
}

export default PageLoader;
