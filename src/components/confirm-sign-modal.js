import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import locale from "../locales/pt-BR";

import RoundedButton from "./rounded-button";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .4)",
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonPanel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
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
    marginBottom: 20,
  },
  signButton: {
    backgroundColor: "#00BFD8",
  },
});

class ConfirmSignModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    plipName: PropTypes.string,

    onPlipSign: PropTypes.func.isRequired,
    onToggleSignModal: PropTypes.func.isRequired,
  };

  state = {
    fadeAnim: new Animated.Value(0),
    bottom: new Animated.Value(-300),
  };

  static defaultProps = {
    isVisible: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (prevProps.isVisible === false) {
        Animated.sequence([
          Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.bottom, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      } else {
        Animated.sequence([
          Animated.timing(this.state.bottom, {
            toValue: -300,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }
  }

  renderButtonSign() {
    const { onPlipSign } = this.props;

    const title = locale.sign;
    const action = onPlipSign;
    const signButton = styles.signButton;
    const titleStyle = styles.text;
    const buttonStyle = styles.button;

    return (
      <RoundedButton
        title={title}
        action={action}
        buttonStyle={[buttonStyle, signButton]}
        titleStyle={titleStyle}
      />
    );
  }

  renderButtonCancel() {
    const { onToggleSignModal } = this.props;

    const title = locale.cancel;
    const action = onToggleSignModal;
    const titleStyle = styles.text;
    const buttonStyle = styles.button;

    return (
      <RoundedButton
        title={title}
        action={action}
        buttonStyle={buttonStyle}
        titleStyle={titleStyle}
      />
    );
  }

  render() {
    const { isVisible, onToggleSignModal, plipName } = this.props;

    const { fadeAnim, bottom } = this.state;

    if (!isVisible) return null;

    const modalTitle = locale.signPlip;
    const modalDescription = (
      <Text style={styles.text}>
        Clique em &quot;<Text style={styles.bold}>Assinar</Text>&quot; para
        confirmar sua colaboração ao Projeto de Lei:{" "}
        <Text style={styles.bold}>{plipName}</Text>.
      </Text>
    );

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.background}
          onPress={onToggleSignModal}
        />
        <Animated.View style={[styles.modal, { bottom: bottom }]}>
          <Text style={[styles.text, styles.title]}>{modalTitle}</Text>
          <View style={styles.descriptionContainer}>{modalDescription}</View>
          <View style={styles.buttonPanel}>
            {this.renderButtonCancel()}
            {this.renderButtonSign()}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

export default ConfirmSignModal;
