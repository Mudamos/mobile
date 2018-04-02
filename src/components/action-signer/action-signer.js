import React from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
} from "react-native";

import {
  branch,
  compose,
  renderComponent,
  setPropTypes,
  withProps,
} from "recompose";

import PropTypes from "prop-types";

import {
  prop,
} from "ramda";

import Layout from "../purple-layout";
import SplashLoader from "../splash-loader";

import locale from "../../locales/pt-BR";

const enhance = compose(
  withProps(({ done, error, errorIdentifier }) => ({
    errorMessage: error ? locale.actionSignerError[errorIdentifier] || errorIdentifier : null,
    isLoading: !done,
    success: done && !error,
  })),
  setPropTypes({
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
  }),
  branch(
    prop("isLoading"),
    renderComponent(() => <SplashLoader isVisible={true} loadingTitle={locale.executingActionWait} />)
  ),
);

const ActionSigner = enhance(({
  error,
  errorMessage,
  success,
}) => (
  <View style={styles.container}>
    <Layout contentStyle={styles.layout}>
      <Image
        source={require("../../images/Logo-alt.png")}
      />

      <View style={styles.result}>
        { success && <Text style={styles.resultText}>{locale["success!"]}</Text> }
        { error && <Text style={styles.resultText}>{errorMessage}</Text> }
      </View>
    </Layout>
  </View>
));

ActionSigner.propTypes = {
  done: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorIdentifier: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  layout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  result: {
    backgroundColor: "transparent",
    marginHorizontal: 20,
  },
  resultText: {
    color: "white",
    fontFamily: "roboto",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ActionSigner;
