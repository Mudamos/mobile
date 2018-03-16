import PropTypes from "prop-types";
import React from "react";

import { Text, View, ViewPropTypes } from "react-native";

import LinearGradient from "react-native-linear-gradient";

import locale from "../locales/pt-BR";

import styles from "../styles/signed-message-view";


const SignedMessageView = ({ date, style }) => {
  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={["#00DB5E", "#00A79E"]}
        style={[styles.container, style]}
      >
        <Text style={styles.projectSigned}>{locale.projectSigned}</Text>
        <Text style={styles.userSignDate} numberOfLines={2}>{date.format("DD/MM/YYYY HH:mm")}</Text>
      </LinearGradient>
    </View>
  );
}

SignedMessageView.propTypes = {
  date: PropTypes.object.isRequired,
  style: ViewPropTypes.style,
};

export default SignedMessageView;
