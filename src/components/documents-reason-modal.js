import PropTypes from "prop-types";
import React from "react";

import {
  View,
} from "react-native";


import Modal from "./modal";
import ModalLink from "./modal-link-button";

import locale from "../locales/pt-BR";

import styles from "../styles/documents-reason";


export default class DocumentsReasonModal extends Modal {
  static propTypes = {
    onAcknowledge: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onAcknowledge } = this.props;

    return (
      <View style={styles.footer}>
        <ModalLink
          title={locale.gotIt.toUpperCase()}
          onPress={() => this.hideAnimated(onAcknowledge)}
        />
      </View>
    );
  }
}
