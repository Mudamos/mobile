import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import CpfInput from "./cpf-input";
import VoteCardInput from "./vote-card-input";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";
import Modal from "./documents-reason-modal";
import NavigationBar from "./navigation-bar";
import Checkbox from "./white-flat-checkbox";

import styles from "../styles/profile-documents-layout";
import textStyles from "../styles/text";

import { errorForField } from "../utils";

import locale from "../locales/pt-BR";

export default class ProfileDocumentsLayout extends Component {
  state = {
    cpf: this.props.previousCpf,
    voteCard: this.props.previousVoteCard,
    reasonEnabled: false,
    searchedVoteCardId: null,
    termsAccepted: false,
  }

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousCpf: PropTypes.string,
    previousVoteCard: PropTypes.string,
    searchedVoteCardId: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onTSERequested: PropTypes.func.isRequired,
    onTermsRequested: PropTypes.func.isRequired,
  }

  get validForm() {
    return [
      this.state.cpf,
      this.state.voteCard,
    ].every(v => String(v).length === 14);
  }

  get saveEnabled() {
    return this.validForm && this.state.termsAccepted;
  }

  componentWillReceiveProps(nextProps) {
    const { searchedVoteCardId } = nextProps;

    if (searchedVoteCardId && !this.state.searchedVoteCardId) {
      this.setState({ searchedVoteCardId, voteCard: searchedVoteCardId });
    }
  }

  render() {
    const {
      errors,
      isSaving,
      onTermsRequested,
      onTSERequested,
    } = this.props;

    const { reasonEnabled } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.documentsHeaderTitle}
            </Text>

            <View style={styles.inputContainer}>
              <VoteCardInput
                value={this.state.voteCard}
                onChangeVoteCardText={voteCard => this.setState({voteCard})}
                placeholder={locale.voteCard}
                hasError={!!errorForField("voteidcard", errors)}
                error={errorForField("voteidcard", errors)}
                hint="Ex: 9999.9999.9999"
                onSubmitEditing={() => this.cardInput.blur()}
                ref={ref => this.cardInput = ref}
              />

              <TouchableOpacity onPress={onTSERequested} style={styles.cantRememberVoteCardContainer}>
                <Text style={styles.cantRememberVoteCard}>
                  {locale.cantRememberVoteCard}
                </Text>
              </TouchableOpacity>

              <CpfInput
                value={this.state.cpf}
                onChangeCpfText={cpf => this.setState({cpf})}
                placeholder={locale.cpf.toUpperCase()}
                hasError={!!errorForField("cpf", errors)}
                error={errorForField("cpf", errors)}
                hint="Ex: 999.999.999-99"
                onSubmitEditing={() => this.cpfInput.blur()}
                ref={ref => this.cpfInput = ref}
              />

              <View
                style={styles.termsContainer}
              >
                <Checkbox
                  checked={this.state.termsAccepted}
                  onCheckedChange={({ checked }) => this.setState({ termsAccepted: checked })}
                />

                <Text style={styles.terms}>
                  {locale.readAndAgreedWithTermsPrefix}
                </Text>

                <TouchableOpacity
                  onPress={onTermsRequested}
                >
                  <Text style={[styles.terms, styles.termsOfUse]}>{locale.termsOfUse.toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatButton
              title={locale.forward.toUpperCase()}
              enabled={this.saveEnabled}
              onPress={this.onSave.bind(this)}
              style={{marginHorizontal: 20, marginTop: 20}}
            />

            <TouchableOpacity
              onPress={this.enableReason.bind(this)}
              style={styles.whyDocumentsContainer}
            >
              <Text style={styles.whyDocumentsText}>{locale.whyRequestDocuments}</Text>
            </TouchableOpacity>
          </ScrollView>
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

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }

  onSave() {
    const { onSave } = this.props;
    const { cpf, voteCard, termsAccepted } = this.state;

    onSave({ cpf, voteCard, termsAccepted });
  }

  enableReason() {
    Keyboard.dismiss();
    this.setState({ reasonEnabled: true });
  }
}
