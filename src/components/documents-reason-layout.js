import React, { PropTypes } from "react";

import {
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";

import locale from "../locales/pt-BR";
import styles from "../styles/documents-reason";


const DocumentsReasonLayout = ({ onAcknowledge }) => {
  return (
    <View style={styles.container}>
      <Layout>
        <View style={styles.cardContainer}>
          <Image
            source={require("../images/header-people.png")}
            style={styles.peopleImage}
            resizeMode="cover"
          >
            <HeaderLogo style={styles.logo}/>
          </Image>

          <View style={styles.contentContainer}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>
                {locale.whyRequestDocumentsAlternative}
              </Text>

              <Text style={styles.text}>
                {locale.documentsReasonExplained}
              </Text>
            </ScrollView>

            <Text
              style={styles.link}
              onPress={onAcknowledge}
            >
              {locale.gotIt.toUpperCase()}
            </Text>
          </View>
        </View>
      </Layout>
    </View>
  );
};

DocumentsReasonLayout.propTypes = {
  onAcknowledge: PropTypes.func.isRequired,
};

export default DocumentsReasonLayout;
