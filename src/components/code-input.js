import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import MDTextInput from "./md-text-input";

import styles from "../styles/code-input";

export default class CodeInput extends Component {
  static propTypes = {
    codeSize: PropTypes.number,
    length: PropTypes.number,
    marginFromCode: PropTypes.number,
    value: PropTypes.string,
    onChangeCodeText: PropTypes.func.isRequired,
  }

  static defaultProps = {
    codeSize: 36,
    length: 5,
    marginFromCode: 5,
  }

  get hiddenFieldWidth() {
    const { codeSize, length, marginFromCode } = this.props;

    return codeSize * length + (marginFromCode * (length - 1))
  }

  render() {
    const {
      value,
      length,
      ...mdInputProps
    } = this.props;

    const fields = new Array(length).fill(0).map(this.buildField.bind(this));

    return (
      <View style={styles.container}>
        <View style={styles.fieldsContainer}>
          {fields}
        </View>

        <View style={styles.hiddenFieldContainer}>

          <MDTextInput
            {...mdInputProps}

            ref={ref => this.hiddenField = ref}
            value={value}
            maxLength={length}
            keyboardType="numeric"
            onChangeText={text => this.onChangeText(text)}
            underlineEnabled={false}
            mdContainerStyle={{
              width: this.hiddenFieldWidth,
              flex: 0,
              height: 0,
            }}
            textInputStyle={{ color: "transparent" }}
            selectionColor="transparent"
          />

        </View>
      </View>
    );
  }

  buildField(_value, index) {
    const ref = this.fieldRefStr(index);

    const {
      length,
      codeSize,
      marginFromCode,
    } = this.props;

    const value = this.getValue(ref);
    const last = index + 1 === length;

    return (
      <MDTextInput

        key={`codeInput${index}`}
        ref={ref}
        value={value}
        maxLength={1}
        onFocus={() => this.hiddenField.focus()}
        mdContainerStyle={{width: codeSize, flex: 0, marginRight: (last ? 0 : marginFromCode)}}
        textInputStyle={{ textAlign: "center"  }}
      />
    );
  }

  fieldRefStr(index) {
    return String(index);
  }

  getValue(field) {
    return (this.props.value || "").charAt(parseInt(field, 10));
  }

  onChangeText(text) {
    const { onChangeCodeText } = this.props;

    onChangeCodeText(text)
  }

  focus() {
    this.hiddenField.focus();
  }

  blur() {
    this.hiddenField.blur();
  }
}
