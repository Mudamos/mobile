import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";


import Modal from "./modal";

import locale from "../locales/pt-BR";

import styles from "../styles/plip-signed-modal";
import textStyles from "../styles/text";


export default class PlipSignedModal extends Modal {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onClose, onShare } = this.props;

    return (
      <View style={styles.footer}>
        <Text
          style={textStyles.modalLink}
          onPress={() => this.hideAnimated(onClose)}
        >
          {locale.close.toUpperCase()}
        </Text>

        <Text
          style={[textStyles.modalLink, styles.marginLeft]}
          onPress={onShare}
        >
          {locale.share.toUpperCase()}
        </Text>
      </View>
    );
  }
}
