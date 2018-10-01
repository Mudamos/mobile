import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  View,
  ViewPropTypes,
} from "react-native";

import styles from "../styles/circular-page-loader";

class PageLoader extends Component {
  static propTypes = {
    append: PropTypes.node,
    isVisible: PropTypes.bool,
    prepend: PropTypes.node,
    progress: PropTypes.number,
    style: ViewPropTypes.style,
  }

  static defaultProps = {
    progress: 0,
    isVisible: false,
  }

  render() {
    const {
      append,
      isVisible,
      progress,
      prepend,
      style,
    } = this.props;

    if (!isVisible) return (<View/>);

    const circleDiameter = 200;
    const circleDimensions = ({ height: circleDiameter, width: circleDiameter});
    const progressToPercentage = parseInt((100 * progress), 10);

    /*
          1    - circleDiameter
      progress - progressLayerFill

      progressLayerFill = circleDiameter * progress / 1
    */

    const progressLayerFill = circleDiameter * progress;

    return (
      <View style={[styles.container, style]}>
        {prepend}

        <View style={[styles.loader, circleDimensions]}>
          <View style={[styles.progressLayer, circleDimensions, { borderBottomWidth: progressLayerFill }]}/>
          <Text style={styles.progressText}>{progressToPercentage} %</Text>
        </View>

        {append}
      </View>
    );
  }
}

export default PageLoader;
