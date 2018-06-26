import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  MKTextField,
} from "react-native-material-kit";

const selectionColor = "rgba(255, 255, 255, 0.5)";
const errorColor = "#ffff00";
const whiteTransparent = "rgba(255,255,255,0.7)";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  hint: {
    fontFamily: "roboto",
    fontSize: 10,
    color: "#fff",
    marginTop: 3,
  },
  errorText: {
    color: errorColor,
  },
  eyeIcon: {
    position: "absolute",
    top: 30,
    right: 0,
  },
  textFieldStyle: {
    height: 48,
    marginTop: 10,
  },
  textInputStyle: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    flex: 1,
  },
});


export default class MDTextInput extends Component {
  static propTypes = {
    error: PropTypes.string,
    hasError: PropTypes.bool,
    hint: PropTypes.string,
    mdContainerStyle: PropTypes.object,
    mdErrorTextStyle: PropTypes.object,
    mdHintTextStyle: PropTypes.object,
    ...MKTextField.propTypes,
  }

  static defaultProps = {
    floatingLabelEnabled: true,
    hasError: false,
    placeholderTextColor: whiteTransparent,
    tintColor: "rgba(255,255,255,0.7)",
    floatingLabelFont: {
      fontFamily: "roboto",
      fontSize: 14,
    },
    selectionColor: selectionColor,
    style: style.textFieldStyle,
    underlineEnabled: true,
  }

  state = {
    icEye: "visibility-off",
    togglePassword: true
  }

  input = null;

  setInput = component => this.input = component;

  get highlightColor() {
    return (this.props.hasError && errorColor) || whiteTransparent;
  }

  get tintColor() {
    return (this.props.hasError && errorColor) || this.props.tintColor;
  }

  get message() {
    const { error, hasError, hint } = this.props;
    return hasError ? error : hint;
  }

  changePasswordType = () => {
    let newState;
    if (this.state.togglePassword) {
        newState = {
            icEye: 'visibility',
            togglePassword: false
        }
    } else {
        newState = {
            icEye: 'visibility-off',
            togglePassword: true
        }
    }

    this.setState(newState)

  };

  render() {
    const {
      hasError,
      mdContainerStyle,
      mdErrorTextStyle,
      mdHintTextStyle,
      textInputStyle,
      floatingLabelFont,
      underlineEnabled,
      selectionColor,
      password,

      ...textFieldProps
    } = this.props;

    const { icEye, togglePassword } = this.state;

    return (
      <View style={[style.container, mdContainerStyle]}>

        <MKTextField
          {...textFieldProps}
          password={password && togglePassword}
          ref={this.setInput}
          tintColor={this.tintColor}
          selectionColor={selectionColor}
          highlightColor={this.highlightColor}
          textInputStyle={[style.textInputStyle, textInputStyle]}
          floatingLabelFont={floatingLabelFont}
          underlineSize={underlineEnabled ? 1 : 0}
          underlineEnabled={underlineEnabled}
        />
        { password &&
          <Icon
            style={style.eyeIcon}
            name={icEye}
            size={24}
            color="#fff"
            onPress={this.changePasswordType}
          />
        }

        {
          this.message &&
            <Text style={[style.hint, mdHintTextStyle, hasError && style.errorText, hasError && mdErrorTextStyle]}>
              {this.message}
            </Text>
        }
      </View>
    );
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }
}
