import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import FlatButton from "./flat-button";
import DateInput from "./date-input";
import ZipCodeInput from "./zip-code-input";

import locale from "../locales/pt-BR";

import { errorForField } from "../utils";

import styles from "../styles/profile-update-layout";


export default class ProfileUpdateLayout extends Component {
  state = {
    birthdate: this.props.previousBirthdate,
    name: this.props.previousName,
    zipCode: this.props.previousZipCode,
  };

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousBirthdate: PropTypes.string,
    previousName: PropTypes.string,
    previousZipCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  get validForm() {
    const validBirth = String(this.state.birthdate).length === 10;
    const validName = String(this.state.name).length > 0;
    const validZip = String(this.state.zipCode).length === 9;

    return [
      validBirth,
      validName,
      validZip,
    ].every(v => v);
  }

  get formEnabled() {
    return this.validForm;
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
          <ScrollView>
            <HeaderLogo />

            <BackButton
              containerStyle={styles.backButton}
              onPress={onBack}
            />

            <Text style={styles.headerTitle}>
              {locale.profileUpdateTitle}
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

              <DateInput
                placeholder={locale.birthdate}
                value={this.state.birthdate}
                onChangeDateText={birthdate => this.setState({ birthdate })}
                hasError={!!errorForField("birthday", errors)}
                error={errorForField("birthday", errors)}
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={ref => this.birthInput = ref}
              />

              <ZipCodeInput
                value={this.state.zipCode}
                onChangeZipCodeText={zipCode => this.setState({zipCode})}
                placeholder={locale.zipCode}
                hasError={!!errorForField("zipcode", errors)}
                error={errorForField("zipcode", errors)}
                hint="Ex: 00000-000"
                onSubmitEditing={() => this.zipInput.blur()}
                ref={ref => this.zipInput = ref}
              />

            </View>

            <FlatButton
              title={locale.save.toUpperCase()}
              enabled={this.formEnabled}
              onPress={this.onSubmit.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  onSubmit() {
    const { birthdate, name, zipCode } = this.state;
    const { onSave } = this.props;

    onSave({ birthdate, name, zipCode });
  }
}
