import React, { Component, PropTypes } from "react";

import {
  Text,
} from "react-native";


import SimpleModal from "./simple-modal";
import PurpleFlatButton from "./purple-flat-button";

import locale from "../locales/pt-BR";

import textStyles from "../styles/text";


export default class PlipSignedModal extends Component {
  static propTypes = {
    plipName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  };

  render() {
    const {
      plipName,
      onClose,
      onShare,
    } = this.props;

    return (
      <SimpleModal onClose={onClose}>
        <Text style={textStyles.modalTitle}>
          {locale.projectSignedYeah}
        </Text>

        <Text style={textStyles.modalText}>
          {
            `${locale.projectSignedCongratulations} "${plipName}"!`
          }
        </Text>

        <PurpleFlatButton
          title={locale.share.toUpperCase()}
          onPress={onShare}
          style={{marginTop: 40}}
        />
      </SimpleModal>
    );
  }
}
