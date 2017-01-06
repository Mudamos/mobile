import React from "react";

import { Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";

import styles from "../styles/purple-flat-button";


export default class PurpleFlatButton extends FlatButton {
  renderButton() {
    const {
      enabled,
      title,
    } = this.props;

    const Button = this.buttonClass().withText("").build();

    return (
      <Button>
        <LinearGradient
          start={[0.0, 0.25]}
          end={[0.7, 1.0]}
          locations={[0, 1.5, 2.0]}
          style={styles.gradientContainer}
          colors={["#7E52D8", "#9427DB", "#9526DB"]}
        >
          <Text style={[styles.text, { opacity: enabled ? 1 : 0.5 }]}>
            {title}
          </Text>
        </LinearGradient>
      </Button>
    );
  }
}
