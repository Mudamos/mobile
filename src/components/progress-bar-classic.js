import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
} from "react-native";

const barColor = "#00BFD8";
const textColor = "#000";
const backgroundColor = "#FFF";

const styles = StyleSheet.create({
  flexBox: {
    flex: 1,
    flexDirection: "row",
  },
  progressBar: {
    overflow: "hidden",
    height: 30,
    borderWidth: 1,
    borderColor: barColor,
    marginBottom: 5,
  },
  barLeft: {
    backgroundColor: barColor,
  },
  barRight: {
    backgroundColor: backgroundColor,
    minWidth: 50,
  },
  textContainer: {
    position: "absolute",
    left: 0,
    top: 2,
    paddingLeft: 5,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    color: textColor,
  },
});

export default class ProgressBarClassic extends Component {
  static propTypes = {
    value: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    LayoutAnimation.spring();
    this.setState({value: nextProps.value});
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  render() {
    return (
      <View>
        <View style={[styles.flexBox, styles.progressBar]}>
          <View style={[styles.barLeft, {flex:this.state.value}]}></View>
          <View style={[styles.barRight, {flex:100 - this.state.value}]}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{this.state.value}%</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

ProgressBarClassic.defaultProps = {
  value: 0,
}
