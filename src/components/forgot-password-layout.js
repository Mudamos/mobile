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

import locale from "../locales/pt-BR";

import styles from "../styles/forgot-password-layout";


export default class ForgotPasswordLayout extends ComponentWithKeyboardEvent {
  state = {};

  static propTypes = {
    isSaving: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onHasCode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  get validForm() {
    return !!this.state.email;
  }

  get formEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      isSaving,
      onBack,
      onHasCode,
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
              {locale.forgotPasswordTitle}
            </Text>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.email}
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                keyboardType="email-address"
                onSubmitEditing={() => this.emailInput.blur()}
                ref={ref => this.emailInput = ref}
              />
            </View>

            <FlatButton
              title={locale.sendCode.toUpperCase()}
              enabled={this.formEnabled}
              onPress={this.onSubmit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <Text
              style={styles.hasCode}
              onPress={onHasCode}
            >
              {locale.alreadyHavePasswordCode.toUpperCase()}
            </Text>
          </KeyboardAwareScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  onSubmit() {
    const { email } = this.state;
    const { onSave } = this.props;

    onSave(email);
  }
}
