import React, { PropTypes } from "react";

import {
  Text,
  TouchableOpacity,
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
import Modal from "./documents-reason-modal";

import styles from "../styles/profile-documents-layout";
import textStyles from "../styles/text";

import { errorForField } from "../utils";

import locale from "../locales/pt-BR";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default class ProfileDocumentsLayout extends ComponentWithKeyboardEvent {
  state = {
    cpf: this.props.previousCpf,
    voteCard: this.props.previousVoteCard,
    reasonEnabled: false,
  }

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousCpf: PropTypes.string,
    previousVoteCard: PropTypes.string,
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
      onTSERequested,
    } = this.props;

    const { reasonEnabled } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          <KeyboardAwareScrollView
            automaticallyAdjustContentInsets={false}
            style={styles.scrollView}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <HeaderLogo />

            <Text style={styles.headerTitle}>
              {locale.documentsHeaderTitle}
            </Text>

            <TransparentFlatButton
              title={locale.whyRequestDocuments}
              onPress={() => this.setState({ reasonEnabled: true })}
              style={{marginHorizontal: 20}}
            />

            <View style={{marginHorizontal: 33, marginTop: 5}}>
              <CpfInput
                value={this.state.cpf}
                onChangeCpfText={cpf => this.setState({cpf})}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errorForField("cpf", errors)}
                hint={errorForField("cpf", errors)}
                onSubmitEditing={() => this.cpfInput.blur()}
                ref={ref => this.cpfInput = ref}
              />

              <VoteCardInput
                value={this.state.voteCard}
                onChangeVoteCardText={voteCard => this.setState({voteCard})}
                placeholder={locale.voteCard}
                mdContainerStyle={{marginVertical: 20}}
                hasError={!!errorForField("voteidcard", errors)}
                hint={errorForField("voteidcard", errors)}
                onSubmitEditing={() => this.cardInput.blur()}
                ref={ref => this.cardInput = ref}
              />

              <TouchableOpacity onPress={onTSERequested}>
                <Text style={styles.cantRememberVoteCard}>
                  {locale.cantRememberVoteCard}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatButton
              title={locale.confirm.toUpperCase()}
              enabled={this.saveEnabled}
              onPress={this.onSave.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

          </KeyboardAwareScrollView>
        </Layout>

        {
          reasonEnabled &&
            <Modal
              onAcknowledge={() => this.setState({ reasonEnabled: false })}
            >
              <Text style={textStyles.modalTitle}>
                {locale.whyRequestDocumentsAlternative}
              </Text>

              <Text style={textStyles.modalText}>
                {locale.documentsReasonExplained}
              </Text>
            </Modal>
        }

        <PageLoader isVisible={isSaving} />

      </View>
    );
  }

  onSave() {
    const { onSave } = this.props;
    const { cpf, voteCard } = this.state;

    onSave({ cpf, voteCard });
  }
}
