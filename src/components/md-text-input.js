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
    backgroundColor: "transparent",
  },
  hint: {
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
      fontSize: 12,
      fontWeight: "200",
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
      hint,
      mdContainerStyle,
      mdErrorTextStyle,
      mdHintTextStyle,
      textInputStyle,
      floatingLabelFont,

      ...textFieldProps
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
          underlineSize={1}
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
}
