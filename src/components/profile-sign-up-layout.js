import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  compose,
  withHandlers,
  withStateHandlers,
} from "recompose";

import {
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./back-button";
import MDTextInput from "./md-text-input";
import DateInput from "./date-input";
import VoteCardInput from "./vote-card-input";
import NavigationBar from "./navigation-bar";
import RoundedButton from "./rounded-button";
import SignUpBreadCrumb from "./sign-up-breadcrumb";
import StaticFooter from "./static-footer";
import DocumentsReasonModal from "./documents-reason-modal";

import locale from "../locales/pt-BR";

import { errorForField } from "../utils";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "../styles/profile-sign-up-layout";

class ProfileSignUpLayout extends Component {
  static propTypes = {
    birthdate: PropTypes.string,
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    name: PropTypes.string,
    previousBirthdate: PropTypes.string,
    previousName: PropTypes.string,
    previousZipCode: PropTypes.string,
    voteCard: PropTypes.string,
    zipCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSetBirthdate: PropTypes.func.isRequired,
    onSetName: PropTypes.func.isRequired,
    onSetVoteCard: PropTypes.func.isRequired,
    onSigningUp: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onTSERequested: PropTypes.func.isRequired,
  }

  state = {
    reasonEnabled: false,
  };

  componentDidMount() {
    const { onSigningUp } = this.props;

    onSigningUp();
  }

  get validForm() {
    const {
      birthdate,
      name,
      voteCard,
    } = this.props;

    const validBirth = String(birthdate).length === 10;
    const validName = String(name).length > 0;
    const validVoteCard = String(voteCard).length === 14;

    return [
      validBirth,
      validName,
      validVoteCard,
    ].every(v => v);
  }

  get formEnabled() {
    return this.validForm;
  }

  enableReason = () => {
    Keyboard.dismiss();
    this.onToggleReasonEnabled();
  }

  onToggleReasonEnabled = () => {
    this.setState(({ reasonEnabled }) => ({ reasonEnabled: !reasonEnabled }));
  }

  render() {
    const {
      birthdate,
      name,
      voteCard,
      errors,
      isSaving,
      onOpenURL,
      onSubmit,
      onSetName,
      onSetBirthdate,
      onSetVoteCard,
      onTSERequested,
    } = this.props;

    const { reasonEnabled } = this.state;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView style={styles.container}>
            {this.renderNavBar()}

            <SignUpBreadCrumb highlightId={2} containerStyle={styles.breadcrumb} />

            <Text style={styles.headerTitle}>
              {locale.profileSignUpTitle}
            </Text>

            <View>
              <TouchableOpacity
                onPress={this.enableReason}
                style={[styles.whyDocumentsContainer, styles.warningContainer]}
              >
                <MaterialCommunityIcons name="alert-decagram" size={24} color={"#FFF"} />
                <Text style={styles.whyDocumentsText}>{locale.whyRequestDocuments}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={name}
                onChangeText={onSetName}
                hasError={!!errorForField("name", errors)}
                error={errorForField("name", errors)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              <DateInput
                placeholder={locale.birthdate}
                value={birthdate}
                onChangeDateText={onSetBirthdate}
                hasError={!!errorForField("birthday", errors)}
                error={errorForField("birthday", errors)}
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={ref => this.birthInput = ref}
              />

              <VoteCardInput
                value={voteCard}
                onChangeVoteCardText={onSetVoteCard}
                placeholder={locale.voteCard}
                hasError={!!errorForField("voteidcard", errors)}
                error={errorForField("voteidcard", errors)}
                hint="Ex: 0000.0000.0000"
                onSubmitEditing={() => this.cardInput.blur()}
                ref={ref => this.cardInput = ref}
              />
              <TouchableOpacity onPress={onTSERequested} style={styles.cantRememberVoteCardContainer}>
                <Text style={styles.cantRememberVoteCardText}>
                  {locale.cantRememberVoteCard}
                </Text>
              </TouchableOpacity>
            </View>

            <RoundedButton title={locale.continue} enabled={this.formEnabled} action={onSubmit} buttonStyle={styles.continueButton} titleStyle={styles.continueButtonTitle}/>

            <DocumentsReasonModal isVisible={reasonEnabled} onToggleReasonEnabled={this.onToggleReasonEnabled}/>

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
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

const enhance = compose(
  withStateHandlers(
    { birthdate: "", name: "", voteCard: "" },
    {
      onSetBirthdate: () => value => ({
        birthdate: value,
      }),
      onSetName: () => value => ({
        name: value,
      }),
      onSetVoteCard: () => value => ({
        voteCard: value,
      }),
    }
  ),
  withHandlers({
    onSubmit: ({ birthdate, name, voteCard, onSave }) => () => onSave({ birthdate, name, voteCard }),
  })
);

export default enhance(ProfileSignUpLayout);
