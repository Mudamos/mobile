import PropTypes from "prop-types";
import React, { Component } from "react";

import { Keyboard, Text, TouchableOpacity, View } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

import Icon from "react-native-vector-icons/MaterialIcons";

import { MKTextField } from "react-native-material-kit";

const selectionColor = "rgba(255, 255, 255, 0.5)";
const errorColor = "#DB4437";
const whiteTransparent = "rgba(255,255,255,0.7)";

const style = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  hint: {
    fontFamily: "roboto",
    fontSize: "0.8rem",
    color: "#fff",
    marginTop: 3,
    marginBottom: 8,
  },
  errorText: {
    color: errorColor,
    fontSize: "0.8rem",
  },
  eyeIcon: {
    position: "absolute",
    bottom: "1.8rem",
    right: 0,
  },
  textFieldStyle: {
    height: 48,
    marginTop: 10,
  },
  textInputStyle: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: "1.1rem",
    flex: 1,
  },
});

export default class MDTextInput extends Component {
  static propTypes = {
    error: PropTypes.string,
    errorLink: PropTypes.func,
    hasError: PropTypes.bool,
    hint: PropTypes.string,
    mdContainerStyle: PropTypes.object,
    mdErrorTextStyle: PropTypes.object,
    mdHintTextStyle: PropTypes.object,
    ...MKTextField.propTypes,
  };

  static defaultProps = {
    floatingLabelEnabled: true,
    hasError: false,
    placeholderTextColor: whiteTransparent,
    tintColor: "rgba(255,255,255,0.7)",
    floatingLabelFont: {
      fontFamily: "roboto",
      fontSize: 16,
    },
    selectionColor: selectionColor,
    style: style.textFieldStyle,
    underlineEnabled: true,
  };

  state = {
    icEye: "visibility-off",
    togglePassword: true,
  };

  input = null;

  setInput = (component) => (this.input = component);

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
    Keyboard.dismiss();
    this.setState(({ togglePassword }) => ({
      togglePassword: !togglePassword,
      icEye: togglePassword ? "visibility" : "visibility-off",
    }));
  };

  render() {
    const {
      errorLink,
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
          style={{}}
          textInputStyle={[style.textInputStyle, textInputStyle]}
          floatingLabelFont={floatingLabelFont}
          underlineSize={underlineEnabled ? 1 : 0}
          underlineEnabled={underlineEnabled}
          placeholderTextColor={hasError ? errorColor : this.tintColor}
        />
        {password && (
          <Icon
            style={style.eyeIcon}
            name={icEye}
            size={24}
            color="#fff"
            onPress={this.changePasswordType}
          />
        )}

        {this.message && hasError ? (
          <TouchableOpacity onPress={errorLink}>
            <Text
              style={[
                style.hint,
                mdHintTextStyle,
                hasError && style.errorText,
                hasError && mdErrorTextStyle,
              ]}>
              {this.message}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              style.hint,
              mdHintTextStyle,
              hasError && style.errorText,
              hasError && mdErrorTextStyle,
            ]}>
            {this.message}
          </Text>
        )}
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
