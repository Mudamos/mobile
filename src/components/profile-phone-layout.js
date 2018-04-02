import PropTypes from "prop-types";
import React, { Component } from "react";

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
import NavigationBar from "./navigation-bar";

import styles from "../styles/profile-phone-layout";

import locale from "../locales/pt-BR";

export default class ProfilePhoneLayout extends Component {
  state = {
    phone: this.props.phone,
  }

  static propTypes = {
    isSending: PropTypes.bool,
    isValidated: PropTypes.bool,
    phone: PropTypes.string,
    sendErrors: PropTypes.array,
    onPhoneGiven: PropTypes.func.isRequired,
  }

  get sendEnabled() {
    const phone = this.state.phone || "";
    return phone.length >= 14;
  }

  render() {
    const {
      isSending,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}
            {this.renderPhoneForm()}
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSending} />
      </View>
    );
  }

  renderPhoneForm() {
    const {
      sendErrors,
    } = this.props;

    return (
      <View style={styles.contentContainer}>
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
          error={errorForField("number", sendErrors)}
          hint="Ex: (99) 99999-9999"
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

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }

  onSend() {
    const { onPhoneGiven } = this.props;
    const { phone } = this.state;

    onPhoneGiven(phone);
  }
}
