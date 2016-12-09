import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import Layout from "./layout";
import HeaderLogo from "./header-logo";
import CpfInput from "./cpf-input";
import VoteCardInput from "./vote-card-input";
import FlatButton from "./flat-button";
import PageLoader from "./page-loader";

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

    return (
      <View style={{flex: 1, backgroundColor: "purple"}}>
        <PageLoader isVisible={isSaving} />

        <Layout>
          <KeyboardAwareScrollView style={{flex: 1}} bounces={false}>
            <HeaderLogo />

              <Text style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
                color: "white",
                alignSelf: "center",
                marginBottom: 20}}>
                {locale.documentsHeaderTitle}
              </Text>

              <Text style={{
                textAlign: "center",
                fontSize: 18,
                color: "white",
                alignSelf: "center",
                marginBottom: 20}}>
                Seus documentos são necessários para validar suas assinaturas
              </Text>

            <View style={{marginHorizontal: 30}}>
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
                style={{
                  alignSelf: "center",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Não lembra do seu título?
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
