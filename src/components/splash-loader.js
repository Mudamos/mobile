import React from "react";

import * as Animatable from "react-native-animatable";

import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";
import styles from "../styles/splash-loader";


const SplashLoader = props => {
  return (
    <PageLoader {...props}>
      <Animatable.Text
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
        style={styles.loading}
      >
        {locale.loading}
      </Animatable.Text>
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
