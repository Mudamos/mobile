import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  compose,
  withHandlers,
  withStateHandlers,
} from "recompose";

import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import CpfInput from "./cpf-input";
import MDTextInput from "./md-text-input";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import SignUpBreadCrumb from "./sign-up-breadcrumb";
import StaticFooter from "./static-footer";
import Checkbox from "./multicolor-flat-checkbox";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";
import {
  errorForField,
  validateEmail,
} from "../utils";

import styles from "../styles/sign-up-layout";

const enhance = compose(
  withStateHandlers(
    { cpf: "", email: "", password: "", termsAccepted: false },
    {
      onSetCpf: () => value => ({
        cpf: value,
      }),
      onSetEmail: () => value => ({
        email: value,
      }),
      onSetPassword: () => value => ({
        password: value,
      }),
      onSetTermsAccepted: () => value => ({
        termsAccepted: value.checked,
      }),
    }
  ),
  withHandlers({
    onSubmit: ({ email, cpf, password, termsAccepted, isFacebookUser, onCreate, onUpdate }) => () => {
      if (isFacebookUser) {
        return onUpdate({ cpf, email, termsAccepted })
      } else {
        return onCreate({ cpf, email, password, termsAccepted });
      }
    },
    onBackOrHome: ({ isLogged, onNavigate }) => () => {
      if (isLogged) {
        onNavigate("plipsNav");
      } else {
        onNavigate("back");
      }
    },
  })
);

class SignUpLayout extends Component {
  static propTypes = {
    cpf: PropTypes.string,
    createErrors: PropTypes.array,
    email: PropTypes.string,
    isCreating: PropTypes.bool,
    isFacebookUser: PropTypes.bool,
    isLogged: PropTypes.bool,
    isLoggingIn: PropTypes.bool,
    password: PropTypes.string,
    termsAccepted: PropTypes.bool,
    userCpf: PropTypes.string,
    userEmail: PropTypes.string,
    userTermsAccepted: PropTypes.bool,
    onBackOrHome: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSetCpf: PropTypes.func.isRequired,
    onSetEmail: PropTypes.func.isRequired,
    onSetPassword: PropTypes.func.isRequired,
    onSetTermsAccepted: PropTypes.func.isRequired,
    onSigningUp: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onTermsRequested: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  state = {
    errors: {},
  };

  componentDidMount() {
    const { userCpf, userEmail, userTermsAccepted, onSetCpf, onSetEmail, onSetTermsAccepted, onSigningUp } = this.props;

    if (this.validCpf(userCpf)) {
      onSetCpf(userCpf);
    }

    if (this.validEmail(userEmail)) {
      onSetEmail(userEmail);
    }

    if (userTermsAccepted) {
      onSetTermsAccepted({checked: userTermsAccepted});
    }

    onSigningUp();
  }

  componentDidUpdate(prevProps) {
    const { cpf, email, password, termsAccepted } = this.props;

    if (prevProps.cpf !== cpf) {
      this.checkCpf();
    }

    if (prevProps.email !== email) {
      this.checkEmail();
    }

    if (prevProps.password !== password) {
      this.checkPassword();
    }

    if (prevProps.termsAccepted !== termsAccepted) {
      this.checkTermsAccepted();
    }
  }

  validCpf = cpf => cpf && String(cpf).length === 14;

  validPassword = password => password && String(password).length > 0;

  validEmail = email => email && validateEmail(email);

  get validForm() {
    const { cpf, email, password, isFacebookUser, termsAccepted } = this.props;

    if (isFacebookUser) {
      return [
        this.validCpf(cpf),
        this.validEmail(email),
        termsAccepted,
      ].every(v => v);
    } else {
      return [
        this.validCpf(cpf),
        this.validEmail(email),
        this.validPassword(password),
        termsAccepted,
      ].every(v => v);
    }
  }

  get createEnabled() {
    return this.validForm;
  }

  allTextFieldsValid = () => {
    const { cpf, email, password, isFacebookUser } = this.props;

    if (isFacebookUser) {
      return [
        this.validCpf(cpf),
        this.validEmail(email),
      ].every(v => v);
    } else {
      return [
        this.validCpf(cpf),
        this.validEmail(email),
        this.validPassword(password),
      ].every(v => v);
    }
  }

  checkCpf = () => {
    const { cpf, termsAccepted } = this.props;
    const shouldShowMessage = this.allTextFieldsValid() && !termsAccepted;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        cpf: this.validCpf(cpf) ? null : locale.invalidCpf,
        termsAccepted: shouldShowMessage ? locale.acceptTermsToContinue : null,
      },
    }));
  };

  checkEmail = () => {
    const { email, termsAccepted } = this.props;
    const shouldShowMessage = this.allTextFieldsValid() && !termsAccepted;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        email: this.validEmail(email) ? null : locale.invalidEmail,
        termsAccepted: shouldShowMessage ? locale.acceptTermsToContinue : null,
      },
    }));
  };

  checkPassword = () => {
    const { password, termsAccepted } = this.props;
    const shouldShowMessage = this.allTextFieldsValid() && !termsAccepted;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        password: this.validPassword(password) ? null : locale.invalidPassword,
        termsAccepted: shouldShowMessage ? locale.acceptTermsToContinue : null,
      },
    }));
  };

  checkTermsAccepted = () => {
    const { termsAccepted } = this.props;

    const shouldShowMessage = this.allTextFieldsValid() && !termsAccepted;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        termsAccepted: shouldShowMessage ? locale.acceptTermsToContinue : null,
      },
    }));
  };

  onBack = () => {
    const { isLogged, onNavigate, onLogout } = this.props;

    onNavigate("back");

    if (isLogged) {
      onLogout();
    }
  }

  render() {
    const {
      createErrors,
      isCreating,
      isLoggingIn,
    } = this.props;

    const {
      email,
      cpf,
      isFacebookUser,
      password,
      termsAccepted,
      userEmail,
      onOpenURL,
      onSetEmail,
      onSetCpf,
      onSetPassword,
      onSetTermsAccepted,
      onSubmit,
      onTermsRequested,
    } = this.props;

    const {
      errors,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <SignUpBreadCrumb highlightId={1} containerStyle={styles.breadcrumb} />

            <Text style={styles.headerTitleText}>{locale.signUpTitle}</Text>

            <View style={styles.inputContainer}>
              <CpfInput
                value={cpf}
                onChangeCpfText={onSetCpf}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errorForField("cpf", createErrors) || !!errors.cpf}
                error={errorForField("cpf", createErrors) || errors.cpf}
                errorLink={this.onBack}
                hint="Ex: 000.000.000-00"
                onSubmitEditing={() => this.cpfInput.blur()}
                ref={ref => this.cpfInput = ref}
              />

              { !this.validEmail(userEmail) &&
                <MDTextInput
                  placeholder={locale.emailForAccess}
                  value={email}
                  onChangeText={onSetEmail}
                  hasError={!!errorForField("email", createErrors) || !!errors.email}
                  error={errorForField("email", createErrors) || errors.email}
                  errorLink={this.onBack}
                  keyboardType="email-address"
                  onSubmitEditing={() => this.emailInput.blur()}
                  ref={ref => this.emailInput = ref}
                  autoCapitalize="none"
                />
              }

              { !isFacebookUser &&
                <MDTextInput
                  placeholder={locale.choosePassword}
                  value={password}
                  onChangeText={onSetPassword}
                  password={true}
                  hasError={!!errorForField("password", createErrors) || !!errors.password}
                  error={errorForField("password", createErrors) || errors.password}
                  onSubmitEditing={() => this.passwordInput.blur()}
                  ref={ref => this.passwordInput = ref}
                />
              }

              <View style={styles.termsAcceptedContainer}>
                <Checkbox
                  checked={termsAccepted}
                  onCheckedChange={onSetTermsAccepted}
                  style={styles.termsAcceptedCheckbox}
                />
                <Text style={[styles.termsAcceptedText, styles.text]}>
                  {locale.readAndAgreedWithTermsPrefix}
                </Text>

                <TouchableOpacity
                  onPress={onTermsRequested}
                >
                  <Text style={[styles.termsAcceptedText, styles.text, styles.termsAcceptedLink]}>{locale.termsOfUse.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
              { !!errors.termsAccepted &&
                <Text style={styles.termsAcceptedTextAlert}>
                  {errors.termsAccepted}
                </Text>
              }
            </View>

            <View style={styles.buttonContainer}>
              <RoundedButton title={locale.continue} enabled={this.createEnabled} action={onSubmit} buttonStyle={styles.continueButton} titleStyle={styles.continueButtonTitle}/>
            </View>

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>
        <PageLoader isVisible={isCreating || isLoggingIn} />
      </SafeAreaView>
    );
  }

  renderNavBar() {
    const { onBackOrHome } = this.props;

    return (
      <NavigationBar
        leftView={<BackButton onPress={onBackOrHome} />}
        middleView={<HeaderLogo />}
      />
    );
  }
}

export default enhance(SignUpLayout);
