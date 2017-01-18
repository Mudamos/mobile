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

import styles from "../styles/change-password-layout";


export default class ChangePasswordLayout extends ComponentWithKeyboardEvent {
  state = {}

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.currentPassword,
      this.state.newPassword,
    ].every(v => v);
  }

  get formEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      errors,
      isSaving,
      onBack,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
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
              {locale.changePasswordTitle}
            </Text>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.currentPassword}
                value={this.state.currentPassword}
                onChangeText={currentPassword => this.setState({ currentPassword })}
                password={true}
                hasError={!!errorForField("currentPassword", errors)}
                hint={errorForField("currentPassword", errors)}
                onSubmitEditing={() => this.currentPasswordInput.blur()}
                ref={ref => this.currentPasswordInput = ref}
              />

              <MDTextInput
                placeholder={locale.newPassword}
                value={this.state.newPassword}
                onChangeText={newPassword => this.setState({ newPassword })}
                password={true}
                hasError={!!errorForField("newPassword", errors)}
                hint={errorForField("newPassword", errors)}
                onSubmitEditing={() => this.newPasswordInput.blur()}
                ref={ref => this.newPasswordInput = ref}
              />
            </View>

            <FlatButton
              title={locale.save.toUpperCase()}
              enabled={this.formEnabled}
              onPress={this.submit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />
          </KeyboardAwareScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  submit() {
    const { onSave } = this.props;
    const { currentPassword, newPassword } = this.state;

    onSave({ currentPassword, newPassword });
  }
}
