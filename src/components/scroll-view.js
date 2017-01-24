import React from "react";

import {
  ScrollView,
} from "react-native";

import styles from "../styles/scroll-view";


const MyScrollView = props => (
  <ScrollView
    {...props}

    style={[styles.scrollView, props.style]}
  >
    {props.children}
  </ScrollView>
);

MyScrollView.propTypes = {
  ...ScrollView.propTypes,
};

MyScrollView.defaultProps = {
  keyboardShouldPersistTaps: true,
  automaticallyAdjustContentInsets: false,
  bounces: false,
  showsVerticalScrollIndicator: false,
};

export default MyScrollView;
