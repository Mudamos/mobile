import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  compose,
  withHandlers,
  withStateHandlers,
} from "recompose";

import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import MDTextInput from "./md-text-input";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import FlatButton from "./flat-button";
import FBLoginButton from "./fb-login-button";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

import styles from "../styles/sign-up-layout";


class SignUpLayout extends Component {
  static propTypes = {
    createErrors: PropTypes.array,
    email: PropTypes.string,
    isCreating: PropTypes.bool,
    isLoggingIn: PropTypes.bool,
    name: PropTypes.string,
    password: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onSetEmail: PropTypes.func.isRequired,
    onSetName: PropTypes.func.isRequired,
    onSetPassword: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  get validForm() {
    const { email, name, password } = this.props;

    return [
      name,
      email,
      password,
    ].every(v => v);
  }

  get createEnabled() {
    return this.validForm;
  }

  render() {
    const {
      createErrors,
      isCreating,
      isLoggingIn,
      onSignIn,
    } = this.props;

    const {
      email,
      name,
      password,
      onSetEmail,
      onSetName,
      onSetPassword,
      onSubmit,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.signUpTitle}
            </Text>

            {this.renderFBLogin()}

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={name}
                onChangeText={onSetName}
                hasError={!!errorForField("name", createErrors)}
                error={errorForField("name", createErrors)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              <MDTextInput
                placeholder={locale.email}
                value={email}
                onChangeText={onSetEmail}
                hasError={!!errorForField("email", createErrors)}
                error={errorForField("email", createErrors)}
                keyboardType="email-address"
                onSubmitEditing={() => this.emailInput.blur()}
                ref={ref => this.emailInput = ref}
                autoCapitalize="none"
              />

              <MDTextInput
                placeholder={locale.password}
                value={password}
                onChangeText={onSetPassword}
                password={true}
                hasError={!!errorForField("password", createErrors)}
                error={errorForField("password", createErrors)}
                onSubmitEditing={() => this.passwordInput.blur()}
                ref={ref => this.passwordInput = ref}
              />
            </View>

            <FlatButton
              title={locale.enroll.toUpperCase()}
              enabled={this.createEnabled}
              onPress={onSubmit}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <View style={styles.signInContainer}>
              <TouchableOpacity onPress={onSignIn}>
                <Text style={styles.lightText}>
                  {locale.hasAnAccountAlready}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onSignIn}>
                <Text style={styles.login}>
                  {locale.performLogin}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isCreating || isLoggingIn} />
      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;
    return (
      <NavigationBar
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
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
}

const enhance = compose(
  withStateHandlers(
    { name: "", email: "", password: "" },
    {
      onSetName: () => value => ({
        name: value,
      }),
      onSetEmail: () => value => ({
        email: value,
      }),
      onSetPassword: () => value => ({
        password: value,
      }),
    }
  ),
  withHandlers({
    onSubmit: ({ email, name, password, onCreate }) => () => onCreate({ name, email, password }),
  })
);

export default enhance(SignUpLayout);
