import PropTypes from "prop-types";
import React from "react";

import { Text, View } from "react-native";

import styles from "../styles/signed-message-view";

import locale from "../locales/pt-BR";

const SignedMessageView = ({ date }) => {
  const day = date.format("DD/MM/YYYY");
  const time = date.format("HH:mm");

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.projectSigned}>
        {locale.youSignedThisProjectAt({ day: day, time: time })}
      </Text>
    </View>
  );
};

SignedMessageView.propTypes = {
  date: PropTypes.object.isRequired,
};

export default SignedMessageView;
