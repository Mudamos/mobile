import React, { Component } from "react";
import { Text, View } from "react-native";

import TransparentFlatButton from "./transparent-flat-button";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { StyleSheet } from "react-native";

import locale from "../locales/pt-BR";

import styles from "../styles/fb-login-button";

export default class FBLoginButton extends Component {
  render() {
    return (
      <TransparentFlatButton
        {...this.props}
        style={StyleSheet.flatten(styles.button)}>
        <View style={styles.container}>
          <FAIcon name="facebook-official" style={styles.icon} size={20} />
          <Text style={styles.text}>{locale.facebookLogin}</Text>
        </View>
      </TransparentFlatButton>
    );
  }
}
