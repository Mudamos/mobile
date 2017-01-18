import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import MDTextInput from "./md-text-input";
import PageLoader from "./page-loader";
import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import FlatButton from "./flat-button";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

import styles from "../styles/profile-missing-fields-layout";


export default class ProfileMissingFieldsLayout extends ComponentWithKeyboardEvent {
  state = {
    name: this.props.previousName,
  }

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousName: PropTypes.string,
    showEmail: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.name,
      this.state.email,
    ].every(v => v);
  }

  get saveEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      errors,
      isSaving,
      showEmail,
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

            <Text style={styles.headerTitle}>
              {locale.confirmInformation}
            </Text>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", errors)}
                hint={errorForField("name", errors)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              {
                showEmail &&
                  <MDTextInput
                    placeholder={locale.email}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    hasError={!!errorForField("email", errors)}
                    hint={errorForField("email", errors)}
                    keyboardType="email-address"
                    onSubmitEditing={() => this.emailInput.blur()}
                    ref={ref => this.emailInput = ref}
                  />
              }
            </View>

            <FlatButton
              title={locale.enroll.toUpperCase()}
              enabled={this.saveEnabled}
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
    const { name, email } = this.state;

    onSave({ name, email });
  }
}
