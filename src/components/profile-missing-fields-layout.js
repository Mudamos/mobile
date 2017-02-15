import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import MDTextInput from "./md-text-input";
import PageLoader from "./page-loader";
import FlatButton from "./flat-button";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

import styles from "../styles/profile-missing-fields-layout";


export default class ProfileMissingFieldsLayout extends Component {
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
    return this.validForm;
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
          <ScrollView>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.confirmInformation}
            </Text>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", errors)}
                error={errorForField("name", errors)}
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
                    error={errorForField("email", errors)}
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
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }

  submit() {
    const { onSave } = this.props;
    const { name, email } = this.state;

    onSave({ name, email });
  }
}
