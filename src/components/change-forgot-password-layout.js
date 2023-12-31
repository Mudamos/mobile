import PropTypes from "prop-types";
import React, { Component } from "react";

import { TouchableOpacity, Text, View } from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import CodeInput from "./code-input";
import FlatButton from "./flat-button";
import NavigationBar from "./navigation-bar";
import SafeAreaView from "./safe-area-view";

import { errorForField } from "../utils";

import locale from "../locales/pt-BR";

import styles from "../styles/change-forgot-password-layout";

const codeInputContainerStyle = { marginHorizontal: 13 };
const submitButtonStyle = { marginHorizontal: 20, marginTop: 20 };

export default class ChangeForgotPasswordLayout extends Component {
  state = {};

  static propTypes = {
    emailSent: PropTypes.string,
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onResendCode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  get validForm() {
    const code = this.state.code || "";
    const codeSize = 5;
    return !!this.state.password && code.length === codeSize;
  }

  get formEnabled() {
    return this.validForm;
  }

  render() {
    const { emailSent, errors, isSaving, onResendCode } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.changeForgotPasswordTitle}
            </Text>

            {emailSent && (
              <Text style={styles.fieldGroup}>
                <Text style={styles.fieldTitle}>{locale.emailSentTo}:</Text>{" "}
                {emailSent}
              </Text>
            )}

            <Text style={[styles.actionText, styles.highMargin]}>
              {locale.typeCode}
            </Text>

            <View style={styles.inputContainer}>
              <CodeInput
                value={this.state.code}
                onChangeCodeText={(code) => this.setState({ code })}
                keyboardType="numeric"
                length={5}
                mdContainerStyle={codeInputContainerStyle}
                onSubmitEditing={() => this.codeInput.blur()}
                ref={(ref) => (this.codeInput = ref)}
              />

              <Text style={[styles.actionText, styles.highMargin]}>
                {locale.enterNewPassword}
              </Text>

              <MDTextInput
                placeholder={locale.password}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
                password={true}
                hasError={!!errorForField("password", errors)}
                error={errorForField("password", errors)}
                onSubmitEditing={() => this.passwordInput.blur()}
                ref={(ref) => (this.passwordInput = ref)}
              />
            </View>

            <FlatButton
              title={locale.change.toUpperCase()}
              enabled={this.formEnabled}
              onPress={this.onSubmit.bind(this)}
              style={submitButtonStyle}
            />

            <TouchableOpacity onPress={onResendCode}>
              <Text style={styles.resendCode}>
                {locale.resendCode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </SafeAreaView>
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

  onSubmit() {
    const { code, password } = this.state;
    const { onSave } = this.props;

    onSave({ code, password });
  }
}
