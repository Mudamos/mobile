import React, { PropTypes } from "react";
import {
  Text,
  StyleSheet,
  View,
} from "react-native";

import Layout from "../purple-layout";
import FlatButton from "../flat-button";
import HeaderLogo from "../header-logo";
import NavigationBar from "../navigation-bar";
import SplashLoader from "../splash-loader";

const ActionSigner = ({
  errorMessage,
  hasError,
  result,
  onCloseSignActionApp,
}) => {
  const isLoading = !result && !hasError;
  if (isLoading) {
    return <SplashLoader isVisible={true} loadingTitle="Efetuando ação. Aguarde..." />
  }

  if (result) {
    return <SplashLoader isVisible={true} loadingTitle="Sucesso!" />
  }

  return (
    <View style={styles.container}>
      <Layout>
        <NavigationBar
          middleView={<HeaderLogo />}
        />

        <View style={styles.contentContainer}>
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
        </View>
      </Layout>
    </View>
  );
};

ActionSigner.propTypes = {
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  result: PropTypes.string,
  onCloseSignActionApp: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  error: {
    backgroundColor: "red",
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
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
