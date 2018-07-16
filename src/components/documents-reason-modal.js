import PropTypes from "prop-types";
import React, { Component } from "react";

import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import locale from "../locales/pt-BR";

import EvilIcons from "react-native-vector-icons/EvilIcons";

import HeaderLogo from "./header-logo";
import NavigationBar from "./navigation-bar";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .4)",
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonPanel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    elevation: 8,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#7705B9",
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  text: {
    color: "#FFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
});

class DocumentsReasonModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,

    onToggleReasonEnabled: PropTypes.func.isRequired,
  }

  state = {
    fadeAnim: new Animated.Value(0),
    top: new Animated.Value(-300),
  }

  static defaultProps = {
    isVisible: false,
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (prevProps.isVisible === false) {
        Animated.sequence([
          Animated.timing(
            this.state.fadeAnim,
            {
              toValue: 1,
              duration: 200,
            }),
          Animated.timing(
            this.state.top,
            {
              toValue: 0,
              duration: 300,
            }),
        ]).start();
      } else {
        Animated.sequence([
          Animated.timing(
            this.state.top,
            {
              toValue: -300,
              duration: 100,
            }),
          Animated.timing(
            this.state.fadeAnim,
            {
              toValue: 0,
              duration: 200,
            }),
        ]).start();
      }
    }
  }

  render() {
    const {
      isVisible,
      onToggleReasonEnabled,
    } = this.props;

    const {
      fadeAnim,
      top,
    } = this.state;

    if (!isVisible) return null;

    const modalTitle = locale.whyRequestDocumentsAlternative;
    const modalDescription = locale.documentsReasonExplained;

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.background} onPress={onToggleReasonEnabled} />
        <Animated.View style={[styles.modal, {top: top}]}>
          <NavigationBar
            middleView={<HeaderLogo />}
          />
          <Text style={[styles.text, styles.title]}>{modalTitle}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.text}>{modalDescription}</Text>
          </View>
          <View style={styles.buttonPanel}>
            <TouchableOpacity onPress={onToggleReasonEnabled} >
              <EvilIcons name="close-o" size={44} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default DocumentsReasonModal;
