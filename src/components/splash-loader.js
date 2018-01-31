import React, { PropTypes } from "react";
import { Image } from "react-native";

import * as Animatable from "react-native-animatable";

import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";
import styles from "../styles/splash-loader";


const SplashLoader = ({ loadingTitle = locale.loading, ...props }) => {
  const logo = (
    <Image
      source={require("../images/Logo-alt.png")}
      style={styles.logo}
    />
  );

  const loading = (
    <Animatable.Text
      animation="pulse"
      easing="ease-out"
      iterationCount="infinite"
      style={styles.loading}
    >
      {loadingTitle}
    </Animatable.Text>
  );

  return (
    <PageLoader
      {...props}

      prepend={logo}
      append={loading}
    />
  );
}

SplashLoader.propTypes = {
  ...PageLoader.propTypes,
  loadingTitle: PropTypes.string,
};

SplashLoader.defaultProps = {
  style: styles.container,
};

export default SplashLoader;
