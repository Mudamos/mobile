import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import styles from "../styles/profile-birth-layout";

import { errorForField } from "../utils";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import DateInput from "./date-input";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";

import locale from "../locales/pt-BR";


export default class ProfileBirthLayout extends Component {
  state = {}

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
  }

  get valid() {
    // Simple validation that the input is valid;
    return String(this.state.birthdate).length === 10;
  }

  get formEnabled() {
    return this.valid;
  }

  render() {
    const {
      errors,
      isSaving,
      onSave,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.scrollView}>
            <HeaderLogo />

            <Text style={styles.headerTitle}>
              {locale.birthdayHeaderTitle}
            </Text>

            <DateInput
              placeholder={locale.birthdate}
              value={this.state.birthdate}
              onChangeDateText={birthdate => this.setState({ birthdate })}
              mdContainerStyle={{marginHorizontal: 13}}
              hasError={!!errorForField("birthday", errors)}
              error={errorForField("birthday", errors)}
              hint="Ex: 31/12/1980"
              onSubmitEditing={() => this.birthInput.blur()}
              ref={ref => this.birthInput = ref}
            />

            <FlatButton
              title={locale.forward.toUpperCase()}
              enabled={this.formEnabled}
              onPress={() => onSave(this.state.birthdate)}
              style={{marginTop: 20}}
            />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }
}
