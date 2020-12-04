import React from "react";

import { Text, View } from "react-native";

import FlatButton from "./flat-button";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/retry-button";
import locale from "../locales/pt-BR";

class RetryButton extends FlatButton {
  renderButton() {
    const { enabled } = this.props;

    const builder = this.buttonClass().withText("");

    const Button = builder.build();
    const opacity = enabled ? styles.enabled : styles.disabled;

    return (
      <Button>
        <View style={styles.container}>
          <Icon
            name="error"
            size={24}
            color="#595959"
            style={[styles.icon, opacity]}
          />
          <Text style={[styles.text, opacity]}>{locale.retry}</Text>
        </View>
      </Button>
    );
  }
}

export default RetryButton;
