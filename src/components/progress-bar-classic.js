import React from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  Text,
  View,
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

const ProgressBarClassic = props => {
  const { value } = props;

  return (
    <View>
      <View style={[styles.flexBox, styles.progressBar]}>
        <View style={[styles.barLeft, {flex: value}]}></View>
        <View style={[styles.barRight, {flex:100 - value}]}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{value}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

ProgressBarClassic.propTypes = {
  value: PropTypes.number,
};

export default ProgressBarClassic;
