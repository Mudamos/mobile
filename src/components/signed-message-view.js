import React, { PropTypes } from "react";

import { Text } from "react-native";

import LinearGradient from "react-native-linear-gradient";

import locale from "../locales/pt-BR";

import styles from "../styles/signed-message-view";


const SignedMessageView = ({ date }) => {
  return (
    <LinearGradient
      colors={["#00DB5E", "#00A79E"]}
      style={styles.container}
    >
      <Text style={styles.projectSigned}>{locale.projectSigned}</Text>
      <Text style={styles.userSignDate} numberOfLines={2}>{date.format("DD/MM/YYYY HH:mm")}</Text>
    </LinearGradient>
  );
}

SignedMessageView.propTypes = {
  date: PropTypes.object.isRequired,
};

export default SignedMessageView;
