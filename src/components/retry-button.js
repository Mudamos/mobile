import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import FlatButton from "./flat-button";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/retry-button";
import locale from "../locales/pt-BR";


class RetryButton extends FlatButton {
  static propTypes = {
    backgroundColor: PropTypes.string,
  };

  renderButton() {
    const {
      backgroundColor,
      enabled,
    } = this.props;

    const builder = this.buttonClass().withText("");

    if (backgroundColor) builder.withBackgroundColor(backgroundColor);

    const Button = builder.build();
    const opacity = enabled ? styles.enabled : styles.disabled;

    return (
      <Button>
        <View style={{ flex: 1, flexDirection: "row"}}>
          <Icon name="error" size={24} color="#595959" style={[styles.icon, opacity]}/>
          <Text style={[styles.text, opacity]}>
            {locale.retry}
          </Text>
        </View>
      </Button>
    );
  }
}

export default RetryButton;

