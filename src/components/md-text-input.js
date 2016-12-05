import React, { Component, PropTypes } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  MKTextField,
} from "react-native-material-kit";

const { MKTextFieldPropTypes } = MKTextField.propTypes;

const selectionColor = "rgba(255, 255, 255, 0.5)";
const errorColor = "#d50000";
const whiteTransparent = "rgba(255,255,255,0.7)";

const style = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  errorText: {
    color: errorColor,
    marginTop: 3,
  },
  textFieldStyle: {
    height: 48,
    marginTop: 10,
  },
  textInputStyle: {
    color: "#fff",
  },
});


export default class MDTextInput extends Component {
  static propTypes = {
    mdContainerStyle: PropTypes.object,
    mdErrorTextStyle: PropTypes.object,
    hasError: PropTypes.bool,
    error: PropTypes.string,
    ...MKTextField.propTypes
  }

  static defaultProps = {
    floatingLabelEnabled: true,
    hasError: false,
    placeholderTextColor: whiteTransparent,
    tintColor: "#fff",
    floatingLabelFont: {
      fontSize: 12,
      fontWeight: '200',
    },
    style: style.textFieldStyle,
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
      error,
      mdContainerStyle,
      mdErrorTextStyle,
      textInputStyle,
      floatingLabelFont,
      ...textFieldProps,
    } = this.props;

    return (
      <View style={[style.container, mdContainerStyle]}>

        <MKTextField
          {...textFieldProps}

          tintColor={this.tintColor}
          selectionColor={selectionColor}
          highlightColor={this.highlightColor}
          textInputStyle={[style.textInputStyle, textInputStyle]}
          floatingLabelFont={floatingLabelFont}
        />

        {
          hasError &&
            <Text style={[style.errorText, mdErrorTextStyle]}>
              {error}
            </Text>
        }
      </View>
    );
  }
}
