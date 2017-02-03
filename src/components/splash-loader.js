import React from "react";
import { Image } from "react-native";

import * as Animatable from "react-native-animatable";

import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";
import styles from "../styles/splash-loader";


const SplashLoader = props => {
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
      {locale.loading}
    </Animatable.Text>
  );

  return (
    <PageLoader
      {...props}

      afterChildren={loading}
      beforeChildren={logo}
    />
  );
}

SplashLoader.propTypes = {
  ...PageLoader.propTypes,
};

SplashLoader.defaultProps = {
  style: styles.container,
};

export default SplashLoader;
