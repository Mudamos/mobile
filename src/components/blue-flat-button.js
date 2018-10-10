import React from "react";

import { StyleSheet, Text, View } from "react-native";
import FlatButton from "./flat-button";

import EStyleSheet from "react-native-extended-stylesheet";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const styles = EStyleSheet.create({
  container: {
    borderRadius: 100,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientContainer: {
    borderRadius: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,

    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontFamily: "roboto",
    fontSize: "1rem",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default class BlueFlatButton extends FlatButton {
  renderButton() {
    const {
      enabled,
      textStyle,
      style,
      title,
      iconName,
    } = this.props;

    const Button = this.buttonClass().withText("").build();

    return (
      <Button style={[styles.container, style]}>
        <Text
          numberOfLines={1}
          textAnchor="middle"
          style={[styles.text, textStyle, { opacity: enabled ? 1 : 0.5 }]}
        >
          {title}
        </Text>
        { iconName &&
          <Icon
            name={iconName}
            size={24}
            color="#FFF"
            style={{marginLeft: 10}}
          />
        }
      </Button>
    );
  }
}
