import { anyPass, isEmpty, isNil } from "ramda";
import React, { PureComponent } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { compose, withStateHandlers } from "recompose";

import BackButton from "./back-button";
import CpfInput from "./cpf-input";
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

import { unMaskCpf, validateCpf } from "../utils";

const isNotPresent = anyPass([isNil, isEmpty]);

const enhance = compose(
  withStateHandlers(
    { cpf: "", email: "" },
    {
      onSetCpf: () => value => ({
        cpf: value,
      }),
      onSetEmail: () => value => ({
        email: value,
      }),
    }
  )
);

class ForgotPasswordLayout extends PureComponent {
  state = {
    errors: {},
  };

  static propTypes = {
    cpf: PropTypes.string,
    email: PropTypes.string,
    isSaving: PropTypes.bool,
    onBack: PropTypes.func.isRequired,
    onHasCode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSetCpf: PropTypes.func.isRequired,
    onSetEmail: PropTypes.func.isRequired,
  }

  get isValidForm() {
    return this.isValidCpf(this.props.cpf);
  }

  get isFormEnabled() {
    return this.isValidForm;
  }

  componentDidUpdate(prevProps) {
    if (this.props.cpf !== prevProps.cpf) {
      this.checkCpf();
    }
  }

  checkCpf = () => {
    const { cpf } = this.props;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        cpf: this.isValidCpf(cpf) ? null : locale.invalidCpf,
      },
    }));
  };

  isValidCpf = cpf => isNotPresent(cpf) || validateCpf(cpf);

  onSubmit = () => {
    const { cpf, email, onSave } = this.props;

    onSave({ cpf: unMaskCpf(cpf), email });
  };

  render() {
    const {
      cpf,
      email,
      isSaving,
      onHasCode,
      onSetCpf,
      onSetEmail,
    } = this.props;

    const { errors } = this.state;

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
                value={email}
                onChangeText={onSetEmail}
                keyboardType="email-address"
                onSubmitEditing={() => this.emailInput.blur()}
                ref={ref => this.emailInput = ref}
              />

              <Text style={styles.fieldTextSeparator}>
                {locale.or.toUpperCase()}
              </Text>

              <CpfInput
                value={cpf}
                onChangeCpfText={onSetCpf}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errors.cpf}
                error={errors.cpf}
                hint="Ex: 000.000.000-00"
                onSubmitEditing={() => this.cpfInput.blur()}
                ref={ref => this.cpfInput = ref}
              />
            </View>

            <FlatButton
              title={locale.sendCode.toUpperCase()}
              enabled={this.isFormEnabled}
              onPress={this.onSubmit}
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
}

export default enhance(ForgotPasswordLayout);
