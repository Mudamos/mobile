import React, { Component, PropTypes } from "react";

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

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

import styles from "../styles/sign-up-layout";


export default class SignUpLayout extends Component {
  state = {}

  static propTypes = {
    createErrors: PropTypes.array,
    isCreating: PropTypes.bool,
    isLoggingIn: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
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
    return this.validForm;
  }

  render() {
    const {
      createErrors,
      isCreating,
      isLoggingIn,
      onBack,
      onSignIn,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView>
            <HeaderLogo />

            <BackButton
              containerStyle={styles.backButton}
              onPress={onBack}
            />

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
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", createErrors)}
                hint={errorForField("name", createErrors)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              <MDTextInput
                placeholder={locale.email}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                hasError={!!errorForField("email", createErrors)}
                hint={errorForField("email", createErrors)}
                keyboardType="email-address"
                onSubmitEditing={() => this.emailInput.blur()}
                ref={ref => this.emailInput = ref}
              />

              <MDTextInput
                placeholder={locale.password}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                password={true}
                hasError={!!errorForField("password", createErrors)}
                hint={errorForField("password", createErrors)}
                onSubmitEditing={() => this.passwordInput.blur()}
                ref={ref => this.passwordInput = ref}
              />
            </View>

            <FlatButton
              title={locale.enroll.toUpperCase()}
              enabled={this.createEnabled}
              onPress={this.submit.bind(this)}
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

  renderFBLogin() {
    const { onFacebookLogin } = this.props;

    return (
      <FBLoginButton
        onPress={onFacebookLogin}
        style={{marginHorizontal: 20, marginTop: 24}}
      />
    );
  }

  submit() {
    const { onCreate } = this.props;
    const { name, email, password } = this.state;

    onCreate({ name, email, password });
  }
}
