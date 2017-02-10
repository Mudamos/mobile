import React, { Component, PropTypes } from "react";

import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { phoneMask } from "../utils";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import CodeInput from "./code-input";
import SimpleModal from "./simple-modal";
import NavigationBar from "./navigation-bar";
import BackButton from "./back-button";

import styles from "../styles/profile-phone-code-layout";
import textStyles from "../styles/text";

import locale from "../locales/pt-BR";

export default class ProfilePhoneCodeLayout extends Component {
  state = {
    code: null,
    showSignUpSuccess: false,
  }

  static propTypes = {
    isResending: PropTypes.bool,
    isValidated: PropTypes.bool,
    isVerifying: PropTypes.bool,
    phone: PropTypes.string, // Navigation injected
    onBack: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onSignUpFinish: PropTypes.func.isRequired,
    onVerifyCode: PropTypes.func.isRequired,
  }

  get verifyEnabled() {
    const code = this.state.code || "";
    const codeSize = 5;
    return code.length === codeSize;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isValidated && !this.state.showSignUpSuccess) {
      this.setState({ showSignUpSuccess: true });
    }
  }

  render() {
    const {
      isResending,
      isVerifying,
    } = this.props;

    const { showSignUpSuccess } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          <ScrollView style={styles.scrollView}>
            {this.renderCodeForm()}
          </ScrollView>
        </Layout>

        {showSignUpSuccess && this.renderSignUpSuccess()}

        <PageLoader isVisible={isVerifying || isResending} />
      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
    );
  }

  renderCodeForm() {
    const { phone, onBack } = this.props;

    return (
      <View style={styles.full}>
        <Text style={styles.subHeader}>
          {locale.codeHasBeenSentToPhone}
        </Text>

        <View style={styles.phoneInfoContainer}>
          <Text style={styles.phoneText}>
            {phoneMask(phone)}
          </Text>
          <TouchableOpacity onPress={onBack} style={styles.wrongNumberContainer}>
            <Text style={styles.link}>{locale.wrongNumber.toLowerCase()}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.typeCodeText}>
          {locale.typeCode}
        </Text>

        <CodeInput
          value={this.state.code}
          onChangeCodeText={code => this.setState({code})}
          keyboardType="numeric"
          length={5}
          mdContainerStyle={{marginHorizontal: 13}}
          onSubmitEditing={() => this.codeInput.blur()}
          ref={ref => this.codeInput = ref}
        />

        <FlatButton
          title={locale.forward.toUpperCase()}
          enabled={this.verifyEnabled}
          onPress={this.onVerifyCode.bind(this)}
          style={{marginTop: 20}}
        />

        <TouchableOpacity onPress={this.onResend.bind(this)}>
          <Text style={styles.resendLink}>
            {locale.resendCode.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSignUpSuccess() {
    return (
      <SimpleModal onClose={this.onSuccessClose.bind(this)}>
        <Text style={textStyles.modalTitle}>
          {locale.congratulations}
        </Text>

        <Text style={textStyles.modalText}>
          {locale.signupSuccessModalText}
        </Text>
      </SimpleModal>
    );
  }

  onSuccessClose() {
    const { onSignUpFinish } = this.props;

    this.setState({ showSignUpSuccess: false });
    onSignUpFinish();
  }

  onResend() {
    const { phone, onResend } = this.props;
    onResend(phone);
  }

  onVerifyCode() {
    const { onVerifyCode } = this.props;
    const { code, phone } = this.state;

    onVerifyCode({ code, phone });
  }
}
