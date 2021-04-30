import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Dimensions, Image, View, StyleSheet, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import SafeAreaView from "../safe-area-view";
import Layout from "../purple-layout";
import NavigationBar from "../navigation-bar";
import BackButton from "../back-button";
import HeaderLogo from "../header-logo";
import PageLoader from "../page-loader";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RoundedButton from "../rounded-button";
import ScrollView from "../scroll-view";

import textStyles from "../../styles/text";
import { isPresent } from "../../utils";
import locale from "../../locales/pt-BR";

const MessageSignLayout = ({ onBack, error }) => {
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const finishedWithError = loading && isPresent(error);

    if (finishedWithError) {
      setIsLoading(false);
    } else if (!isPresent(error)) {
      setIsLoading(true);
    }
  }, [loading, error]);

  return (
    <SafeAreaView style={styles.container}>
      <Layout>
        <ScrollView>
          <NavigationBar
            leftView={<BackButton onPress={onBack} />}
            middleView={<HeaderLogo />}
          />

          <View style={styles.full}>
            <Text style={styles.headerTitle}>{locale.messageSignTitle}</Text>

            {isPresent(error) && (
              <View style={styles.resultContainer}>
                <Image source={require("../../images/erro.png")} />

                <View style={styles.errorContainer}>
                  <MaterialIcons
                    name="error"
                    size={24}
                    color="#fff"
                    style={styles.errorIcon}
                  />
                  <Text style={styles.error}>{error}</Text>
                </View>

                <View style={styles.closeContainer}>
                  <RoundedButton
                    title={locale.close.toUpperCase()}
                    action={onBack}
                    buttonStyle={styles.closeButton}
                    titleStyle={styles.closeButtonTitle}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </Layout>

      <PageLoader isVisible={loading} />
    </SafeAreaView>
  );
};

MessageSignLayout.propTypes = {
  error: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};

export default MessageSignLayout;

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  closeContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  full: {
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  resultContainer: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  errorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  error: {
    color: "#FFF",
    fontSize: "0.875rem",
    fontFamily: "roboto",
    maxWidth: Dimensions.get("window").width - 80,
  },
  errorIcon: {
    marginRight: 16,
  },
  closeButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginHorizontal: 20,
  },
  closeButtonTitle: {
    color: "#FFF",
  },
});
