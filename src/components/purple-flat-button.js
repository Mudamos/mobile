import React from "react";

import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";

import styles from "../styles/purple-flat-button";

const gradientStart = { x: 0.0, y: 0.25 };
const gradientEnd = { x: 0.7, y: 1.0 };
const gradientLocation = [0, 0.9, 1.0];
const gradientColors = ["#7E52D8", "#9427DB", "#9526DB"];

const textSyleFor = ({ enabled }) => ({
  opacity: enabled ? 1 : 0.5,
});

export default class PurpleFlatButton extends FlatButton {
  renderButton() {
    const { enabled, textStyle, title } = this.props;

    const Button = this.buttonClass().withText("").build();

    return (
      <Button>
        <LinearGradient
          start={gradientStart}
          end={gradientEnd}
          locations={gradientLocation}
          style={styles.gradientContainer}
          colors={gradientColors}>
          <Text
            numberOfLines={2}
            style={[styles.text, textStyle, textSyleFor({ enabled })]}>
            {title}
          </Text>
        </LinearGradient>
      </Button>
    );
  }
}
