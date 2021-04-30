import PropTypes from "prop-types";
import React from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import SafeAreaView from "../safe-area-view";
import Layout from "../purple-layout";
import NavigationBar from "../navigation-bar";
import HeaderLogo from "../header-logo";
import RoundedButton from "../rounded-button";
import textStyles from "../../styles/text";

import locale from "../../locales/pt-BR";

const MessageSignSuccessLayout = ({ onFinish }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Layout>
        <NavigationBar middleView={<HeaderLogo />} />

        <View style={styles.full}>
          <Text style={styles.headerTitle}>Sucesso!</Text>

          <View style={styles.center}>
            <Image source={require("../../images/valid.png")} />
          </View>

          <Text style={styles.subtitle}>Assinatura finalizada</Text>

          <View style={styles.buttonContainer}>
            <RoundedButton
              title={locale.actionSigner.finish.toUpperCase()}
              action={onFinish}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonTitle}
            />
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

MessageSignSuccessLayout.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default MessageSignSuccessLayout;

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  center: {
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    marginTop: 40,
  },
  full: {
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  subtitle: {
    textAlign: "center",
    fontFamily: "roboto",
    fontSize: "0.875rem",
    color: "#fff",
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginHorizontal: 20,
  },
  submitButtonTitle: {
    color: "#FFF",
  },
});
