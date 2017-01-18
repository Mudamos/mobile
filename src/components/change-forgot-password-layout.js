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
import CodeInput from "./code-input";
import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import FlatButton from "./flat-button";

import { errorForField } from "../utils";

import locale from "../locales/pt-BR";

import styles from "../styles/change-forgot-password-layout";


export default class ChangeForgotPasswordLayout extends ComponentWithKeyboardEvent {
  state = {};

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onResendCode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  get validForm() {
    const code = this.state.code || "";
    const codeSize = 5;
    return !!this.state.password && code.length === codeSize;
  }

  get formEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      errors,
      isSaving,
      onBack,
      onResendCode,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.full}
          >
            <HeaderLogo />

            <BackButton
              containerStyle={styles.backButton}
              onPress={onBack}
            />

            <Text style={styles.headerTitle}>
              {locale.changeForgotPasswordTitle}
            </Text>

            <Text style={[styles.actionText, styles.highMargin]}>
              {locale.typeCode}
            </Text>

            <View style={styles.inputContainer}>
              <CodeInput
                value={this.state.code}
                onChangeCodeText={code => this.setState({code})}
                keyboardType="numeric"
                length={5}
                mdContainerStyle={{marginHorizontal: 13}}
                onSubmitEditing={() => this.codeInput.blur()}
                ref={ref => this.codeInput = ref}
              />

              <Text style={[styles.actionText, styles.highMargin]}>
                {locale.enterNewPassword}
              </Text>

              <MDTextInput
                placeholder={locale.password}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                password={true}
                hasError={!!errorForField("password", errors)}
                hint={errorForField("password", errors)}
                onSubmitEditing={() => this.passwordInput.blur()}
                ref={ref => this.passwordInput = ref}
              />
            </View>

            <FlatButton
              title={locale.change.toUpperCase()}
              enabled={this.formEnabled}
              onPress={this.onSubmit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <Text
              style={styles.resendCode}
              onPress={onResendCode}
            >
              {locale.resendCode.toUpperCase()}
            </Text>
          </KeyboardAwareScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  onSubmit() {
    const { code, password } = this.state;
    const { onSave } = this.props;

    onSave({code, password});
  }
}
