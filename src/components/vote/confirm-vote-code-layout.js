import PropTypes from "prop-types";
import { isEmpty } from "ramda";
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import { compose, withStateHandlers } from "recompose";

import textStyles from "../../styles/text";

import BackButton from "../back-button";
import CodeInput from "../code-input";
import FlatButton from "../flat-button";
import HeaderLogo from "../header-logo";
import Layout from "../purple-layout";
import NavigationBar from "../navigation-bar";
import PageLoader from "../page-loader";
import SafeAreaView from "../safe-area-view";
import ScrollView from "../scroll-view";
import locale from "../../locales/pt-BR";

import { isPresent } from "../../utils";

const PIN_CODE_SIZE = 5;

const enhance = compose(
  withStateHandlers(
    { pinCode: "" },
    {
      onSetPinCode: () => pinCode => ({ pinCode }),
    }
  )
);

class ConfirmVoteCodeLayout extends PureComponent {
  static propTypes = {
    isSaving: PropTypes.bool.isRequired,
    pinCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSetPinCode: PropTypes.func.isRequired,
  }

  get isValidForm() {
    return this.isValidCode(this.props.pinCode);
  }

  get isFormEnabled() {
    return this.isValidForm && isPresent(this.props.pinCode);
  }

  isValidCode = pinCode => isEmpty(pinCode) || isPresent(pinCode) && pinCode.length === PIN_CODE_SIZE;

  onSubmit = () => {
    const { pinCode, onSave } = this.props;

    onSave({ pinCode });
  };

  render() {
    const {
      pinCode,
      isSaving,
      onSetPinCode,
    } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {locale.confirmVoteCodeTitle}
              </Text>

              <Text style={styles.headerSubtitle}>
                {locale.confirmVoteCodeSubtitle}
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <CodeInput
                value={pinCode}
                onChangeCodeText={onSetPinCode}
                keyboardType="numeric"
                length={PIN_CODE_SIZE}
                mdContainerStyle={{marginHorizontal: 13}}
                onSubmitEditing={() => this.codeInput.blur()}
                ref={ref => this.codeInput = ref}
              />
            </View>

            <FlatButton
              title={locale.sendCode.toUpperCase()}
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
    const { onBack } = this.props;

    return (
      <NavigationBar
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
    );
  }
}

export default enhance(ConfirmVoteCodeLayout);

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
