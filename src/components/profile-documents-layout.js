import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import Layout from "./purple-layout";
import HeaderLogo from "./header-logo";
import CpfInput from "./cpf-input";
import VoteCardInput from "./vote-card-input";
import FlatButton from "./flat-button";
import TransparentFlatButton from "./transparent-flat-button";
import PageLoader from "./page-loader";

import styles from "../styles/profile-documents-layout";

import { errorForField } from "../utils";

import locale from "../locales/pt-BR";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class ProfileDocumentsLayout extends ComponentWithKeyboardEvent {
  state = {
    cpf: this.props.previousCpf,
    voteCard: this.props.previousVoteCard,
  }

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousCpf: PropTypes.string,
    previousVoteCard: PropTypes.string,
    onDocumentsReason: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onTSERequested: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.cpf,
      this.state.voteCard,
    ].every(v => String(v).length === 14);
  }

  get saveEnabled() {
    return this.validForm && !this.state.hasKeyboard;
  }

  render() {
    const {
      errors,
      isSaving,
      onDocumentsReason,
      onTSERequested,
    } = this.props;

    return (
      <View style={styles.container}>
        <PageLoader isVisible={isSaving} />

        <Layout>
          <KeyboardAwareScrollView style={styles.scrollView} bounces={false}>
            <HeaderLogo />

            <Text style={styles.headerTitle}>
              {locale.documentsHeaderTitle}
            </Text>

            <TransparentFlatButton
              title={locale.whyRequestDocuments}
              onPress={onDocumentsReason}
              style={{marginHorizontal: 20}}
            />

            <View style={{marginHorizontal: 33, marginTop: 5}}>
              <CpfInput
                value={this.state.cpf}
                onChangeCpfText={cpf => this.setState({cpf})}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errorForField("cpf", errors)}
                hint={errorForField("cpf", errors)}
              />

              <VoteCardInput
                value={this.state.voteCard}
                onChangeVoteCardText={voteCard => this.setState({voteCard})}
                placeholder={locale.voteCard}
                mdContainerStyle={{marginVertical: 20}}
                hasError={!!errorForField("voteidcard", errors)}
                hint={errorForField("voteidcard", errors)}
              />

              <Text
                onPress={onTSERequested}
                style={styles.cantRememberVoteCard}
              >
                {locale.cantRememberVoteCard}
              </Text>
            </View>

            <FlatButton
              title={locale.confirm.toUpperCase()}
              enabled={this.saveEnabled}
              onPress={this.onSave.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  onSave() {
    const { onSave } = this.props;
    const { cpf, voteCard } = this.state;

    onSave({ cpf, voteCard });
  }
}
