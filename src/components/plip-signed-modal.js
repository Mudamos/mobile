import PropTypes from "prop-types";
import React from "react";

import {
  Text,
  View,
} from "react-native";


import SimpleModal from "./simple-modal";
import ModalLink from "./modal-link-button";

import locale from "../locales/pt-BR";

import textStyles from "../styles/text";
import styles from "../styles/plip-signed-modal";


class MyModal extends SimpleModal {
  static propTypes = {
    onShare: PropTypes.func.isRequired,
  };

  renderFooter() {
    const { onClose, onShare } = this.props;

    return (
      <View style={styles.footer}>
        <ModalLink
          title={locale.close.toUpperCase()}
          onPress={() => this.hideAnimated(onClose)}
          containerStyle={styles.modalLink}
        />

        <ModalLink
          title={locale.shareAlt.toUpperCase()}
          onPress={onShare}
          containerStyle={styles.modalLink}
        />
      </View>
    );
  }
}

const PlipSignedModal = props => {
  const {
    plipName,
    onClose,
    onShare,
  } = props;

  return (
    <MyModal
      onClose={onClose}
      onShare={onShare}
    >
      <Text style={textStyles.modalTitle}>
        {locale.projectSignedYeah({ plipName })}
      </Text>

      <Text style={textStyles.modalText}>
        {locale.projectSignedCongratulations({ plipName })}
      </Text>
    </MyModal>
  );
};


PlipSignedModal.propTypes = {
  plipName: PropTypes.string.isRequired,
  ...MyModal.propTypes,
};

export default PlipSignedModal;
