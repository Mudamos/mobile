import PropTypes from "prop-types";
import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import textStyles from "../styles/text";


const ModalLinkButton = props => {
  const {
    containerStyle,
    linkStyle,
    title,
    onPress,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[textStyles.modalLinkContainer, containerStyle]}
    >
      <Text style={[textStyles.modalLink, linkStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};


ModalLinkButton.propTypes = {
  containerStyle: View.propTypes.style,
  linkStyle: Text.propTypes.style,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default ModalLinkButton;
