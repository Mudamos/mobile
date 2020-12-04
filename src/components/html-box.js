import PropTypes from "prop-types";
import React, { Component } from "react";

import { StyleSheet, View } from "react-native";

import HTML from "react-native-fence-html";

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});

class HTMLBox extends Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    renderers: PropTypes.object,
    style: PropTypes.object,
  };

  static defaultProps = {
    renderers: {},
    style: {},
  };

  render() {
    const { html, style, renderers } = this.props;

    return (
      <View style={styles.full}>
        <HTML html={html} htmlStyles={style} renderers={renderers} />
      </View>
    );
  }
}

export default HTMLBox;
