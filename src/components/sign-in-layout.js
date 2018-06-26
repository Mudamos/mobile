import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Image,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import FlatButton from "./flat-button";
import FBLoginButton from "./fb-login-button";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import StaticFooter from "./static-footer";

import locale from "../locales/pt-BR";

import styles from "../styles/sign-in-layout";


class SignInLayout extends Component {
  state = {};

  static propTypes = {
    isLoggingIn: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onForgotPassword: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.email,
      this.state.password,
    ].every(v => v);
  }

  get signInEnabled() {
    return this.validForm;
  }

  render() {
    const {
      isLoggingIn
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.container}>
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
            {this.renderSeparator()}

            {this.renderLinkToSignUp()}

            <StaticFooter onOpenURL={this.onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isLoggingIn} />
      </View>
    );
  }

  renderHeader() {
    return (
      <View>
        <Image
          source={require("../images/Logo-alt.png")}
          style={styles.logo}
        />

        <Text style={styles.headerTitle}>
          {locale.imAlreadyRegistered}
        </Text>
      </View>
    );
  }

  renderEmailInput() {
    return (
      <MDTextInput
        placeholder={locale.emailRegistered}
        value={this.state.email}
        onChangeText={email => this.setState({ email })}
        keyboardType="email-address"
        autoCapitalize="none"
        onSubmitEditing={() => this.emailInput.blur()}
        ref={ref => this.emailInput = ref}
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
        onChangeText={password => this.setState({ password })}
        onSubmitEditing={() => this.passwordInput.blur()}
        ref={ref => this.passwordInput = ref}
      />
    );
  }

  renderContinueButton() {
    return (
      <View style={styles.continueButtonContainer}>
        <RoundedButton title={locale.continue} action={this.onSubmit.bind(this)} buttonStyle={styles.continueButton} titleStyle={styles.continueButtonTitle}/>
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
    return (
      <NavigationBar
        leftView={<BackButton onPress={this.onBack} />}
      />
    );
  }

  renderFBLogin() {
    return (
      <FBLoginButton
        onPress={this.onFacebookLogin}
        style={{marginHorizontal: 20}}
      />
    );
  }

  renderForgotPassword() {
    return (
      <TouchableOpacity onPress={this.onForgotPassword}>
        <Text style={styles.forgotPassword}>
          {locale.forgotPasswordTitle}
        </Text>
      </TouchableOpacity>
    );
  }

  renderLinkToSignUp() {
    return (
      <View style={styles.signUpContainer}>
        <Text style={styles.registerTitle}>Não tem cadastro?</Text>
        <TouchableOpacity onPress={this.onSignUp}>
          <Text style={styles.registerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onBack = () => this.props.onBack();

  onFacebookLogin = () => this.props.onFacebookLogin();

  onForgotPassword = () => this.props.onForgotPassword();

  onOpenURL = (url) => this.props.onOpenURL(url);

  onSignUp = () => this.props.onSignUp();

  onSubmit() {
    const { email, password } = this.state;
    const { onSignIn } = this.props;

    onSignIn(email, password);
  }
}

export default SignInLayout;
