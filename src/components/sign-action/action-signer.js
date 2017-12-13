import React, { PropTypes } from "react";
import {
  Text,
  StyleSheet,
  View,
} from "react-native";

import Layout from "../purple-layout";
import FlatButton from "../flat-button";

const ActionSigner = ({
  errorMessage,
  hasError,
  result,
  onCloseSignActionApp,
}) => (
  <View style={styles.container}>
    <Layout contentStyle={styles.layout}>
      { hasError &&
        <View style={styles.error}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      }

      { !hasError &&
        <View style={styles.result}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      }

      { (hasError || !!result) &&
        <FlatButton
          title="Fechar"
          onPress={onCloseSignActionApp}
          style={{marginHorizontal: 20, marginTop: 20}}
        />
      }
    </Layout>
  </View>
);

ActionSigner.propTypes = {
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  result: PropTypes.string,
  onCloseSignActionApp: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    backgroundColor: "red",
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
  layout: {
    padding: 20,
    justifyContent: "center",
  },
  result: {
    backgroundColor: "transparent",
  },
  resultText: {
    color: "white",
    textAlign: "center",
  },
});

export default ActionSigner;
