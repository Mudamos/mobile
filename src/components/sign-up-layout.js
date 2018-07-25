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

import locale from "../locales/pt-BR";
import { errorForField } from "../utils";

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
    onSubmit: ({ userEmail, email, cpf, password, termsAccepted, isFacebookUser, onCreate, onUpdate }) => () => {
      if (isFacebookUser) {
        const currentEmail = email || userEmail;
        return onUpdate({ cpf, email: currentEmail, termsAccepted })
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

  componentDidMount() {
    const { userCpf, userEmail, userTermsAccepted, onSetCpf, onSetEmail, onSetTermsAccepted, onSigningUp } = this.props;

    if (userCpf) {
      onSetCpf(userCpf);
    }

    if (userEmail) {
      onSetEmail(userEmail);
    }

    if (userTermsAccepted) {
      onSetTermsAccepted({checked: userTermsAccepted});
    }

    onSigningUp();
  }

  get validForm() {
    const { email, cpf, userEmail, isFacebookUser, password, termsAccepted } = this.props;

    const validCpf = String(cpf).length === 14;

    if (isFacebookUser) {
      return [
        validCpf,
        userEmail || email,
        termsAccepted,
      ].every(v => v);
    } else {
      return [
        validCpf,
        email,
        password,
        termsAccepted,
      ].every(v => v);
    }
  }

  get createEnabled() {
    return this.validForm;
  }

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

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.container}>
            {this.renderNavBar()}

            <SignUpBreadCrumb highlightId={1} containerStyle={styles.breadcrumb} />

            <Text style={styles.headerTitleText}>{locale.signUpTitle}</Text>

            <View style={styles.inputContainer}>
              <CpfInput
                value={cpf}
                onChangeCpfText={onSetCpf}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errorForField("cpf", createErrors)}
                error={errorForField("cpf", createErrors)}
                errorLink={this.onBack}
                hint="Ex: 000.000.000-00"
                onSubmitEditing={() => this.cpfInput.blur()}
                ref={ref => this.cpfInput = ref}
              />

              { !userEmail &&
                <MDTextInput
                  placeholder={locale.emailForAccess}
                  value={email}
                  onChangeText={onSetEmail}
                  hasError={!!errorForField("email", createErrors)}
                  error={errorForField("email", createErrors)}
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
                  hasError={!!errorForField("password", createErrors)}
                  error={errorForField("password", createErrors)}
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
            </View>

            <RoundedButton title={locale.continue} enabled={this.createEnabled} action={onSubmit} buttonStyle={styles.continueButton} titleStyle={styles.continueButtonTitle}/>

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>
        <PageLoader isVisible={isCreating || isLoggingIn} />
      </View>
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
