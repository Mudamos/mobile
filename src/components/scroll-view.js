import React, { forwardRef } from "react";

import {
  ScrollView,
} from "react-native";

import styles from "../styles/scroll-view";


const MyScrollView = forwardRef((props, ref) => (
  <ScrollView
    {...props}

    ref={ref}
    style={[styles.scrollView, props.style]}
  >
    {props.children}
  </ScrollView>
));

MyScrollView.propTypes = {
  ...ScrollView.propTypes,
};

MyScrollView.defaultProps = {
  keyboardShouldPersistTaps: "always",
  automaticallyAdjustContentInsets: false,
  bounces: false,
  showsVerticalScrollIndicator: false,
};

export default MyScrollView;
