import React from "react";

import { StyleSheet, Text, View } from "react-native";
import FlatButton from "./flat-button";

import EStyleSheet from "react-native-extended-stylesheet";

import Icon from "react-native-vector-icons/MaterialIcons";

const styles = EStyleSheet.create({
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
      <Button style={[style, { borderRadius: 100 }]}>
        <View style={{flex: 1, flexDirection: "row"}}>
          <Text
            numberOfLines={1}
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
        </View>
      </Button>
    );
  }
}
