import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";


import Modal from "./modal";

import locale from "../locales/pt-BR";

import styles from "../styles/documents-reason";
import textStyles from "../styles/text";


export default class DocumentsReasonModal extends Modal {
  static propTypes = {
    onAcknowledge: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onAcknowledge } = this.props;

    return (
      <View style={styles.footer}>
        <Text
          style={textStyles.modalLink}
          onPress={() => this.hideAnimated(onAcknowledge)}
        >
          {locale.gotIt.toUpperCase()}
        </Text>
      </View>
    );
  }
}
