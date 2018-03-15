import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  TextInput,
  View,
} from "react-native";

import MIcon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/text-input";

class MyTextInput extends Component {
  static defaultProps = {
    hasError: false,
    editable: true,
    placeholderErrorTextcolor: "red",
  };

  static propTypes = {
    editable: PropTypes.bool,
    errorStyle: View.propTypes.style,
    hasError: PropTypes.bool,
    hint: PropTypes.string,
    inputErrorStyle: TextInput.propTypes.style,
    inputStyle: TextInput.propTypes.style,
    label: PropTypes.string,
    labelStyle: Text.propTypes.style,
    placeholderErrorTextcolor: PropTypes.string,
    style: TextInput.propTypes.style,

    onChange: PropTypes.func,
  };

  focus() {
    this.refs.input.focus();
  }

  render() {
    let properProps = this.props;

    if (this.props.hasError) {
      properProps = Object.assign({}, this.props, {
        placeholderTextColor: this.props.placeholderErrorTextcolor,
      });
    }

    return (
      <View style={[
        styles.container,
        properProps.style,
        properProps.editable === false ? styles.containerDisabled : {},
        properProps.hasError ? styles.containerError : {},
        properProps.hasError ? properProps.errorStyle : {},
      ]}>
        {this.renderLabel(properProps.label)}

        <TextInput
          {...properProps}
          ref="input"
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            properProps.inputStyle,
            properProps.editable === false ? styles.inputDisabled : {},
            properProps.hasError ? styles.inputError : {},
            properProps.hasError ? properProps.inputErrorStyle : {},
          ]}
        />

        {this.renderHint(properProps.hint)}

        {this.renderErrorIcon(properProps.hasError)}
      </View>
    );
  }

  renderHint(hint) {
    if (!hint) return;

    return (
      <View style={styles.hintWrapper}>
        <Text style={styles.hint}>
          {hint}
        </Text>
      </View>
    );
  }

  renderErrorIcon(hasError) {
    if (!hasError) return;

    return (
      <View style={styles.errorIconWrapper}>
        <MIcon name="close" style={styles.errorIcon} />
      </View>
    );
  }

  renderLabel(label) {
    if (!label) return;

    return (
      <View style={styles.labelWrapper}>
        <Text style={[styles.label, this.props.labelStyle]}>
          {label}
        </Text>
      </View>
    );
  }
}

export default MyTextInput;
