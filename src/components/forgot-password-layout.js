import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "./back-button";
import FlatButton from "./flat-button";
import HeaderLogo from "./header-logo";
import Layout from "./purple-layout";
import MDTextInput from "./md-text-input";
import NavigationBar from "./navigation-bar";
import PageLoader from "./page-loader";
import PropTypes from "prop-types";
import SafeAreaView from "./safe-area-view";
import ScrollView from "./scroll-view";
import locale from "../locales/pt-BR";
import styles from "../styles/forgot-password-layout";

export default class ForgotPasswordLayout extends Component {
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
    return this.validForm;
  }

  render() {
    const {
      isSaving,
      onHasCode,
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.forgotPasswordTitle}
            </Text>

            <View style={styles.inputContainer}>
              <MDTextInput
                autoCapitalize="none"
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

            <TouchableOpacity onPress={onHasCode}>
              <Text style={styles.hasCode}>
                {locale.alreadyHavePasswordCode.toUpperCase()}
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
    const { email } = this.state;
    const { onSave } = this.props;

    onSave(email);
  }
}
