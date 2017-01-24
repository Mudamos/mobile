import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import { errorForField } from "../utils";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PhoneInput from "./phone-input";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import CodeInput from "./code-input";

import styles from "../styles/profile-phone-layout";

import locale from "../locales/pt-BR";

export default class ProfilePhoneLayout extends Component {
  state = {
    code: null,
    phone: this.props.phone,
  }

  static propTypes = {
    hasSentValidation: PropTypes.bool,
    isSending: PropTypes.bool,
    isVerifying: PropTypes.bool,
    phone: PropTypes.string,
    sendErrors: PropTypes.array,
    onPhoneGiven: PropTypes.func.isRequired,
    onVerifyCode: PropTypes.func.isRequired,
  }

  get sendEnabled() {
    const phone = this.state.phone || "";
    return phone.length >= 14;
  }

  get verifyEnabled() {
    const code = this.state.code || "";
    const codeSize = 5;
    return code.length === codeSize;
  }

  render() {
    const {
      hasSentValidation,
      isSending,
      isVerifying,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.scrollView}>
            <HeaderLogo />

            { !hasSentValidation && this.renderPhoneForm() }
            { hasSentValidation && this.renderCodeForm() }
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSending || isVerifying} />
      </View>
    );
  }

  renderPhoneForm() {
    const {
      sendErrors,
    } = this.props;

    return (
      <View>
        <Text style={styles.headerTitle}>
          {locale.phoneHeaderTitle}
        </Text>

        <Text style={styles.subHeader}>
          {locale.phoneSubtitle}
        </Text>

        <PhoneInput
          value={this.state.phone}
          onChangePhoneText={phone => this.setState({phone})}
          placeholder={locale.mobile}
          hasError={!!errorForField("number", sendErrors)}
          hint={errorForField("number", sendErrors)}
          mdContainerStyle={{marginHorizontal: 13}}
          onSubmitEditing={() => this.phoneInput.blur()}
          ref={ref => this.phoneInput = ref}
        />

        <FlatButton
          title={locale.sendSMSCode.toUpperCase()}
          enabled={this.sendEnabled}
          onPress={this.onSend.bind(this)}
          style={{marginTop: 40}}
        />
      </View>
    );
  }

  renderCodeForm() {
    const { phone } = this.state;

    return (
      <View style={{flex: 1}}>
        <Text style={styles.subHeader}>
          {locale.codeHasBeenSentToPhone}
        </Text>

        <Text style={styles.phoneText}>
          { phone }
        </Text>

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
          title={locale.verify.toUpperCase()}
          enabled={this.verifyEnabled}
          onPress={this.onVerifyCode.bind(this)}
          style={{marginTop: 20}}
        />

        <Text
          onPress={this.resend.bind(this)}
          style={styles.resendLink}
        >
          {locale.resendCode.toUpperCase()}
        </Text>
      </View>
    );
  }

  resend() {
    this.setState({ code: "" });
    this.onSend();
  }

  onSend() {
    const { onPhoneGiven } = this.props;
    const { phone } = this.state;

    onPhoneGiven(phone);
  }

  onVerifyCode() {
    const { onVerifyCode } = this.props;
    const { code, phone } = this.state;

    onVerifyCode({ code, phone });
  }
}
