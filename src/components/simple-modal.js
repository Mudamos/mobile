import React, { PropTypes } from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import Modal from "./modal";

import locale from "../locales/pt-BR";

import styles from "../styles/simple-modal";
import textStyles from "../styles/text";


export default class SimpleModal extends Modal {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onClose } = this.props;

    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => this.hideAnimated(onClose)}>
          <Text style={textStyles.modalLink}>
            {locale.close.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
