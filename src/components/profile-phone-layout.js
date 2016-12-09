import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import { errorForField } from "../utils";

import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import Layout from "./layout";
import HeaderLogo from "./header-logo";
import PhoneInput from "./phone-input";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import MDTextInput from "./md-text-input";

import locale from "../locales/pt-BR";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class ProfilePhoneLayout extends ComponentWithKeyboardEvent {
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
    return phone.length >= 14 && !this.state.hasKeyboard;
  }

  get verifyEnabled() {
    const code = this.state.code || "";
    const codeSize = 5;
    return code.length === codeSize && !this.state.hasKeyboard;
  }

  render() {
    const {
      hasSentValidation,
      isSending,
      isVerifying,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "purple"}}>
        <PageLoader isVisible={isSending || isVerifying} />

        <Layout>
          <KeyboardAwareScrollView style={{flex: 1}} bounces={false}>
            <HeaderLogo />

            { !hasSentValidation && this.renderPhoneForm() }
            { hasSentValidation && this.renderCodeForm() }
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  renderPhoneForm() {

    const {
      sendErrors,
    } = this.props;

    return (
      <View>
        <View style={{marginHorizontal: 20}}>
          <Text style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 24,
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>
            {locale.phoneHeaderTitle}
          </Text>

          <Text style={{
            textAlign: "center",
            fontSize: 16,
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>
            Um código de confirmação será enviado via SMS
          </Text>
        </View>

        <View style={{marginHorizontal: 30}}>
          <PhoneInput
            value={this.state.phone}
            onChangePhoneText={phone => this.setState({phone})}
            placeholder={locale.mobile}
            hasError={!!errorForField("number", sendErrors)}
            hint={errorForField("number", sendErrors)}
          />
        </View>

        <FlatButton
          title={locale.sendSMSCode.toUpperCase()}
          enabled={this.sendEnabled}
          onPress={this.onSend.bind(this)}
          style={{marginHorizontal: 20, marginTop: 20}}
        />
      </View>
    );
  }

  renderCodeForm() {
    const { phone } = this.state;

    return (
      <View>
        <View style={{marginHorizontal: 20}}>
          <Text style={{
            textAlign: "center",
            fontSize: 16,
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>
            Um código foi enviado para o seu celular:
          </Text>

          <Text style={{
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>
            { phone }
          </Text>

          <Text style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>
            Informe o código
          </Text>
        </View>

        <View style={{marginHorizontal: 30}}>
          <MDTextInput
            value={this.state.code}
            onChangeText={code => this.setState({code})}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <FlatButton
          title={locale.verify.toUpperCase()}
          enabled={this.verifyEnabled}
          onPress={this.onVerifyCode.bind(this)}
          style={{marginHorizontal: 20, marginTop: 20}}
        />

        <Text
          onPress={this.onSend.bind(this)}
          style={{
            textAlign: "center",
            fontSize: 14,
            fontWeight: "bold",
            color: "white",
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          { locale.resendCode.toUpperCase() }
        </Text>

      </View>
    );
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
