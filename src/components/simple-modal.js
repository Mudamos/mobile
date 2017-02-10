import React, { PropTypes } from "react";

import {
  View,
} from "react-native";


import Modal from "./modal";
import ModalLink from "./modal-link-button";

import locale from "../locales/pt-BR";

import styles from "../styles/simple-modal";


export default class SimpleModal extends Modal {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onClose } = this.props;

    return (
      <View style={styles.footer}>
        <ModalLink
          title={locale.close.toUpperCase()}
          onPress={() => this.hideAnimated(onClose)}
        />
      </View>
    );
  }
}
