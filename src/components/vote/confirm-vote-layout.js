import PropTypes from "prop-types";
import { isEmpty } from "ramda";
import React, { PureComponent } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import { compose, withStateHandlers } from "recompose";

import textStyles from "../../styles/text";

import ChevronButton from "../chevron-button";
import PhoneInput from "../phone-input";
import FlatButton from "../flat-button";
import HeaderLogo from "../header-logo";
import Layout from "../purple-layout";
import NavigationBar from "../navigation-bar";
import PageLoader from "../page-loader";
import SafeAreaView from "../safe-area-view";
import ScrollView from "../scroll-view";
import locale from "../../locales/pt-BR";

import { unMaskPhone, isPresent, isValidPhone } from "../../utils";

const enhance = compose(
  withStateHandlers(
    { phone: "" },
    {
      onSetPhone: () => phone => ({ phone }),
    }
  )
);

class ConfirmVoteLayout extends PureComponent {
  state = {
    errors: {},
  };

  static propTypes = {
    isSaving: PropTypes.bool.isRequired,
    phone: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSetPhone: PropTypes.func.isRequired,
  }

  get isValidForm() {
    return this.isValidPhone(this.props.phone);
  }

  get isFormEnabled() {
    return this.isValidForm && isPresent(this.props.phone);
  }

  componentDidUpdate(prevProps) {
    if (this.props.phone !== prevProps.phone) {
      this.checkPhone();
    }
  }

  checkPhone = () => {
    const { phone } = this.props;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        phone: this.isValidPhone(phone) ? null : locale.invalidPhone,
      },
    }));
  };

  isValidPhone = phone => isEmpty(phone) || isValidPhone(phone);

  onBack = () => {
    const { onBack } = this.props;

    Alert.alert(
      locale.warning,
      locale.voteConfirmDismiss,
      [
        { text: locale.cancel },
        { text: locale.leaveAnyway, onPress: onBack },
      ],
    );
  };

  onSubmit = () => {
    const { phone, onSave } = this.props;

    onSave({ phone: unMaskPhone(phone) });
  };

  render() {
    const {
      phone,
      isSaving,
      onSetPhone,
    } = this.props;

    const { errors } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {locale.confirmVoteTitle}
              </Text>

              <Text style={styles.headerSubtitle}>
                {locale.confirmVoteSubtitle}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <PhoneInput
                value={phone}
                onChangePhoneText={onSetPhone}
                placeholder={locale.phone.toUpperCase()}
                hasError={!!errors.phone}
                error={errors.phone}
                hint="Ex: (00) 90000-0000"
                onSubmitEditing={() => this.phoneInput.blur()}
                ref={ref => this.phoneInput = ref}
              />
            </View>

            <FlatButton
              title={locale.send.toUpperCase()}
              enabled={this.isFormEnabled}
              onPress={this.onSubmit}
              style={{marginHorizontal: 20, marginTop: 20}}
            />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </SafeAreaView>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        leftView={<ChevronButton onPress={this.onBack} direction="left"/>}
        middleView={<HeaderLogo />}
      />
    );
  }
}

export default enhance(ConfirmVoteLayout);

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 20,
  },
  headerSubtitle: {
    color: "#FFF",
    fontSize: "0.8rem",
    marginHorizontal: 10,
    textAlign: "justify",
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  inputContainer: {
    marginTop: 20,
    marginHorizontal: 33,
  },
});
