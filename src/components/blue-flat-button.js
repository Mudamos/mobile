import React from "react";

import { Platform, Text } from "react-native";
import FlatButton from "./flat-button";

import EStyleSheet from "react-native-extended-stylesheet";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const styles = EStyleSheet.create({
  container: {
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "roboto",
    fontSize: "1rem",
    color: "#fff",
    flexShrink: 2,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

const iconMarginTop = Platform.OS === "ios" ? 3 : 0;
const iconMarginLeft = 10;
const opacityFor = (enabled) => (enabled ? 1 : 0.5);

export default class BlueFlatButton extends FlatButton {
  renderButton() {
    const {
      enabled,
      textStyle,
      style,
      title,
      iconName,
      numberOfLines,
    } = this.props;

    const Button = this.buttonClass().withText("").build();

    return (
      <Button style={[styles.container, style]}>
        <Text
          numberOfLines={numberOfLines || 1}
          textAnchor="middle"
          style={[styles.text, textStyle, { opacity: opacityFor(enabled) }]}>
          {title}
        </Text>
        {iconName && (
          <Icon
            name={iconName}
            size={24}
            color="#FFF"
            style={{ marginTop: iconMarginTop, marginLeft: iconMarginLeft }}
          />
        )}
      </Button>
    );
  }
}
