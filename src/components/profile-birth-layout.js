import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import { errorForField } from "../utils";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Layout from "./layout";
import DateInput from "./date-input";
import SimpleButton from "./simple-button";
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

  render() {
    const {
      errors,
      isSaving,
      onSave,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "green"}}>
        <PageLoader isVisible={isSaving} />

        <Layout>
          <KeyboardAwareScrollView bounces={false}>
            <DateInput
              label={locale.birthdate}
              value={this.state.birthdate}
              onChangeDateText={birthdate => this.setState({ birthdate })}
              hasError={!!errorForField("birthdate", errors)}
              hint={errorForField("birthdate", errors)}
            />

            <SimpleButton
              disabled={!this.valid}
              onPress={() => onSave(this.state.birthdate)}>
              Confirmar
            </SimpleButton>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }
}
