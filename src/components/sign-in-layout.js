import PropTypes from "prop-types";
import React, { Component } from "react";

import { Image, Platform, TouchableOpacity, Text, View } from "react-native";

import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import FBLoginButton from "./fb-login-button";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import StaticFooter from "./static-footer";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

import styles from "../styles/sign-in-layout";

import Logo from "../images/Logo-alt.png";

import { errorMessageFromCode } from "../utils";

class SignInLayout extends Component {
  state = {};

  static propTypes = {
    authErrorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isFacebookLogged: PropTypes.bool,
    isLogged: PropTypes.bool,
    isLoggingIn: PropTypes.bool,
    onAppleSignIn: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onClearAuthLoginError: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
  };

  get validForm() {
    return [this.state.email, this.state.password].every((v) => v);
  }

  get signInEnabled() {
    return this.validForm;
  }

  get errorMessage() {
    const { authErrorCode } = this.props;
    return errorMessageFromCode({ errorCode: authErrorCode, locale });
  }

  componentWillUnmount() {
    const { onClearAuthLoginError } = this.props;

    onClearAuthLoginError();
  }

  render() {
    const { isFacebookLogged, isLogged, isLoggingIn, onOpenURL } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}
            {this.renderHeader()}

            <View style={styles.inputContainer}>
              {this.renderEmailInput()}
              {this.renderPasswordInput()}
              {this.renderForgotPassword()}
              {this.renderContinueButton()}
            </View>

            {this.renderOrSeparator()}
            {this.renderFBLogin()}
            {this.renderAppleSignIn()}
            {this.renderSeparator()}

            {this.renderLinkToSignUp()}

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isLoggingIn || isLogged || isFacebookLogged} />
      </SafeAreaView>
    );
  }

  renderHeader() {
    return (
      <View>
        <Image source={Logo} style={styles.logo} />

        <Text style={styles.headerTitle}>{locale.imAlreadyRegistered}</Text>
      </View>
    );
  }

  renderEmailInput() {
    return (
      <MDTextInput
        placeholder={locale.emailRegistered}
        value={this.state.email}
        onChangeText={(email) => this.setState({ email })}
        keyboardType="email-address"
        autoCapitalize="none"
        onSubmitEditing={() => this.emailInput.blur()}
        ref={(ref) => (this.emailInput = ref)}
      />
    );
  }

  renderPasswordInput() {
    return (
      <MDTextInput
        placeholder={locale.passwordAtMudamos}
        value={this.state.password}
        password={true}
        autoCapitalize="none"
        onChangeText={(password) => this.setState({ password })}
        onSubmitEditing={() => this.passwordInput.blur()}
        ref={(ref) => (this.passwordInput = ref)}
      />
    );
  }

  renderContinueButton() {
    const { authErrorCode } = this.props;
    return (
      <View style={styles.continueContainer}>
        {authErrorCode && (
          <Text style={styles.authErrorText}>{this.errorMessage}</Text>
        )}
        <View style={styles.continueButtonContainer}>
          <RoundedButton
            title={locale.continue}
            action={this.onSubmit}
            buttonStyle={styles.continueButton}
            titleStyle={styles.continueButtonTitle}
          />
        </View>
      </View>
    );
  }

  renderSeparator() {
    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
      </View>
    );
  }

  renderOrSeparator() {
    return (
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>ou</Text>
        <View style={styles.separatorLine} />
      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return <NavigationBar leftView={<BackButton onPress={onBack} />} />;
  }

  renderFBLogin() {
    const { onFacebookLogin } = this.props;

    return <FBLoginButton onPress={onFacebookLogin} />;
  }

  renderAppleSignIn() {
    if (Platform.OS !== "ios" || !appleAuth.isSupported) return;

    const { onAppleSignIn } = this.props;

    return (
      <AppleButton
        style={styles.appleButton}
        cornerRadius={5}
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={onAppleSignIn}
      />
    );
  }

  renderForgotPassword() {
    const { onForgotPassword } = this.props;

    return (
      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgotPassword}>{locale.forgotPasswordTitle}</Text>
      </TouchableOpacity>
    );
  }

  renderLinkToSignUp() {
    const { onSignUp } = this.props;

    return (
      <View style={styles.signUpContainer}>
        <Text style={styles.registerTitle}>Não tem cadastro?</Text>
        <TouchableOpacity onPress={onSignUp}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onSubmit = () => {
    const { email, password } = this.state;
    const { onSignIn } = this.props;

    onSignIn(email, password);
  };
}

export default SignInLayout;
