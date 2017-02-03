import React from "react";
import {
  Text,
} from "react-native";

import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";
import styles from "../styles/splash-loader";


const SplashLoader = props => {
  return (
    <PageLoader {...props}>
      <Text style={styles.loading}>
        {locale.loading}
      </Text>
    </PageLoader>
  );
}

SplashLoader.propTypes = {
  ...PageLoader.propTypes,
};

SplashLoader.defaultProps = {
  style: styles.container,
};

export default SplashLoader;
