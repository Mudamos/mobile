import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import FlatButton from "./flat-button";
import FBLoginButton from "./fb-login-button";

import locale from "../locales/pt-BR";

import styles from "../styles/sign-in-layout";


class SignInLayout extends ComponentWithKeyboardEvent {
  state = {};

  static propTypes = {
    isLoggingIn: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.email,
      this.state.password,
    ].every(v => v);
  }

  get signInEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      isLoggingIn,
      onBack,
      onForgotPassword,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <HeaderLogo />

            <BackButton
              containerStyle={styles.backButton}
              onPress={onBack}
            />

            <Text style={styles.headerTitle}>
              {locale.signInTitle}
            </Text>

            {this.renderFBLogin()}

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.email}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                keyboardType="email-address"
                onSubmitEditing={() => this.emailInput.blur()}
                ref={ref => this.emailInput = ref}
              />

              <MDTextInput
                placeholder={locale.password}
                value={this.state.password}
                password={true}
                onChangeText={password => this.setState({ password })}
                onSubmitEditing={() => this.passwordInput.blur()}
                ref={ref => this.passwordInput = ref}
              />
            </View>

            <FlatButton
              title={locale.getIn.toUpperCase()}
              enabled={this.signInEnabled}
              onPress={this.onSubmit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <Text
              style={styles.forgotPassword}
              onPress={onForgotPassword}
            >
              {locale.forgotPassword}
            </Text>
          </KeyboardAwareScrollView>
        </Layout>

        <PageLoader isVisible={isLoggingIn} />
      </View>
    );
  }

  renderFBLogin() {
    const { onFacebookLogin } = this.props;

    return (
      <FBLoginButton
        onPress={onFacebookLogin}
        style={{marginHorizontal: 20, marginTop: 24}}
      />
    );
  }

  onSubmit() {
    const { email, password } = this.state;
    const { onSignIn } = this.props;

    onSignIn(email, password);
  }
}

export default SignInLayout;
