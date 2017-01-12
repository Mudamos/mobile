import React, { Component, PropTypes } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MKTextField,
} from "react-native-material-kit";

const selectionColor = "rgba(255, 255, 255, 0.5)";
const errorColor = "#d50000";
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
    opacity: 0.7,
    marginTop: 3,
  },
  errorText: {
    color: errorColor,
  },
  textFieldStyle: {
    height: 48,
    marginTop: 10,
  },
  textInputStyle: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
  },
});


export default class MDTextInput extends Component {
  static propTypes = {
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
      fontSize: 10,
      fontWeight: "200",
    },
    selectionColor: selectionColor,
    style: style.textFieldStyle,
    underlineEnabled: true,
  }

  get highlightColor() {
    return (this.props.hasError && errorColor) || whiteTransparent;
  }

  get tintColor() {
    return (this.props.hasError && errorColor) || this.props.tintColor;
  }

  render() {
    const {
      hasError,
      hint,
      mdContainerStyle,
      mdErrorTextStyle,
      mdHintTextStyle,
      textInputStyle,
      floatingLabelFont,
      underlineEnabled,
      selectionColor,

      ...textFieldProps
    } = this.props;

    return (
      <View style={[style.container, mdContainerStyle]}>

        <MKTextField
          {...textFieldProps}

          ref={ref => this.input = ref}
          tintColor={this.tintColor}
          selectionColor={selectionColor}
          highlightColor={this.highlightColor}
          textInputStyle={[style.textInputStyle, textInputStyle]}
          floatingLabelFont={floatingLabelFont}
          underlineSize={underlineEnabled ? 1 : 0}
          underlineEnabled={underlineEnabled}
        />

        {
          hint &&
            <Text style={[style.hint, mdHintTextStyle, hasError && style.errorText, hasError && mdErrorTextStyle]}>
              {hint}
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
