import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import MDTextInput from "./md-text-input";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import FlatButton from "./flat-button";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

import styles from "../styles/sign-up-layout";


export default class SignUpLayout extends ComponentWithKeyboardEvent {
  state = {}

  static propTypes = {
    createErrors: PropTypes.array,
    isCreating: PropTypes.bool,
    onCreate: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.name,
      this.state.email,
      this.state.password,
    ].every(v => v);
  }

  get createEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      createErrors,
      isCreating,
      onSignIn,
    } = this.props;

    return (
      <View style={styles.container}>
        <PageLoader isVisible={isCreating} />

        <Layout>
          <KeyboardAwareScrollView bounces={false} style={styles.scrollView}>
            <HeaderLogo />

            <BackButton
              style={styles.backButton}
              onPress={() => {}}
            />

            <Text style={styles.headerTitle}>
              {locale.signUpTitle}
            </Text>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", createErrors)}
                hint={errorForField("name", createErrors)}
              />

              <MDTextInput
                placeholder={locale.email}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                hasError={!!errorForField("email", createErrors)}
                hint={errorForField("email", createErrors)}
              />

              <MDTextInput
                placeholder={locale.password}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                password={true}
                hasError={!!errorForField("password", createErrors)}
                hint={errorForField("password", createErrors)}
              />
            </View>

            <FlatButton
              title={locale.enroll.toUpperCase()}
              enabled={this.createEnabled}
              onPress={this.submit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <View style={styles.signInContainer}>
              <Text
                style={styles.lightText}
                onPress={onSignIn}
              >
                {locale.hasAnAccountAlready}
              </Text>

              <Text
                style={styles.login}
                onPress={onSignIn}
              >
                {locale.performLogin}
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  submit() {
    const { onCreate } = this.props;
    const { name, email, password } = this.state;

    onCreate({ name, email, password });
  }
}
