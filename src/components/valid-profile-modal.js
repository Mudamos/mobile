import PropTypes from "prop-types";
import React, { Component } from "react";

import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

import locale from "../locales/pt-BR";

import RoundedButton from "./rounded-button";

const styles = EStyleSheet.create({
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
  buttonContainer: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    elevation: 8,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    backgroundColor: "#7705B9",
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  text: {
    fontSize: "0.8rem",
    textAlign: "center",
    color: "#FFF",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  okButton: {
    backgroundColor: "#00BFD8",
  },
});

class ValidProfileModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,

    onOk: PropTypes.func.isRequired,
    onToggleModal: PropTypes.func.isRequired,
  }

  state = {
    fadeAnim: new Animated.Value(0),
  }

  static defaultProps = {
    isVisible: false,
  }

  componentDidUpdate(prevProps) {
    const { isVisible } = this.props;

    if (isVisible !== prevProps.isVisible) {
      if (isVisible === false) {
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 0,
            duration: 200,
          }
        ).start();
      } else {
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 1,
            duration: 200,
          }
        ).start();
      }
    }
  }

  renderButtonSign() {
    const { onOk } = this.props;

    const title = locale.iWannaSign;
    const action = onOk;
    const okButton = styles.okButton;
    const titleStyle = styles.text;
    const buttonStyle = styles.button;

    return (
      <View style={styles.buttonContainer}>
        <RoundedButton title={title} action={action} buttonStyle={[buttonStyle, okButton]} titleStyle={titleStyle}/>
      </View>
    );
  }

  render() {
    const {
      isVisible,
      onToggleModal,
    } = this.props;

    const {
      fadeAnim,
    } = this.state;

    if (!isVisible) return null;

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.background} onPress={onToggleModal} />
        <Animated.View style={styles.modal}>
          <Text style={[styles.text, styles.title, { marginBottom: 20 }]}>{locale.validProfile}</Text>
          <Text style={[styles.text, styles.bold, { marginBottom: 20 }]}>{locale.profileActive}</Text>
          <Text style={[styles.text, { marginBottom: 20 }]}>{locale.youCanSignAndShare}</Text>
          {this.renderButtonSign()}
        </Animated.View>
      </Animated.View>
    );
  }
}

export default ValidProfileModal;
