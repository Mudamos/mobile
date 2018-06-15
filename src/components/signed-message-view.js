import PropTypes from "prop-types";
import React from "react";

import { Text, View } from "react-native";

import styles from "../styles/signed-message-view";

const SignedMessageView = ({ date }) => {
  const day = date.format("DD/MM/YYYY");
  const time = date.format("HH:mm");

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.projectSigned}>Você assinou este projeto em: {day} às {time}</Text>
    </View>
  );
}

SignedMessageView.propTypes = {
  date: PropTypes.object.isRequired,
};

export default SignedMessageView;
