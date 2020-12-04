import PropTypes from "prop-types";
import React, { Component } from "react";

import { compose, withHandlers, withStateHandlers } from "recompose";

import { Keyboard, Text, TouchableOpacity, View } from "react-native";

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
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

import { errorForField } from "../utils";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "../styles/profile-sign-up-layout";

const enhance = compose(
  withStateHandlers(
    { birthdate: "", name: "", voteCard: "" },
    {
      onSetBirthdate: () => (birthdate) => ({ birthdate }),
      onSetName: () => (name) => ({ name }),
      onSetVoteCard: () => (voteCard) => ({ voteCard }),
    },
  ),
  withHandlers({
    onSubmit: ({ birthdate, name, voteCard, onSave }) => () =>
      onSave({ birthdate, name, voteCard }),
  }),
);

class ProfileSignUpLayout extends Component {
  static propTypes = {
    birthdate: PropTypes.string,
    isSaving: PropTypes.bool,
    name: PropTypes.string,
    previousBirthdate: PropTypes.string,
    previousName: PropTypes.string,
    previousVoteCard: PropTypes.string,
    saveErrors: PropTypes.array,
    voteCard: PropTypes.string,
    voteCardIdFromTSE: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSetBirthdate: PropTypes.func.isRequired,
    onSetName: PropTypes.func.isRequired,
    onSetVoteCard: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onTSERequested: PropTypes.func.isRequired,
  };

  state = {
    reasonEnabled: false,
    errors: {},
  };

  componentDidMount() {
    const {
      previousName,
      previousBirthdate,
      previousVoteCard,
      onSetName,
      onSetBirthdate,
      onSetVoteCard,
    } = this.props;

    if (previousBirthdate) {
      onSetBirthdate(previousBirthdate);
    }

    if (previousName) {
      onSetName(previousName);
    }

    if (previousVoteCard) {
      onSetVoteCard(previousVoteCard);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      birthdate,
      name,
      voteCard,
      voteCardIdFromTSE,
      onSetVoteCard,
    } = this.props;

    if (prevProps.voteCardIdFromTSE !== voteCardIdFromTSE) {
      onSetVoteCard(voteCardIdFromTSE);
    }

    if (prevProps.birthdate !== birthdate) {
      this.checkBirthdate();
    }

    if (prevProps.name !== name) {
      this.checkName();
    }

    if (prevProps.voteCard !== voteCard) {
      this.checkVoteCard();
    }
  }

  validBirthdate = (birthdate) => String(birthdate).length === 10;

  validName = (name) => String(name).length > 0;

  validVoteCard = (voteCard) => String(voteCard).length === 14;

  get validForm() {
    const { birthdate, name, voteCard } = this.props;

    return [
      this.validBirthdate(birthdate),
      this.validName(name),
      this.validVoteCard(voteCard),
    ].every((v) => v);
  }

  get formEnabled() {
    return this.validForm;
  }

  checkBirthdate = () => {
    const { birthdate } = this.props;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        birthdate: this.validBirthdate(birthdate)
          ? null
          : locale.invalidBirthdate,
      },
    }));
  };

  checkName = () => {
    const { name } = this.props;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        name: this.validName(name) ? null : locale.invalidName,
      },
    }));
  };

  checkVoteCard = () => {
    const { voteCard } = this.props;

    this.setState(({ errors }) => ({
      errors: {
        ...errors,
        voteCard: this.validVoteCard(voteCard) ? null : locale.invalidVoteCard,
      },
    }));
  };

  enableReason = () => {
    Keyboard.dismiss();
    this.onToggleReasonEnabled();
  };

  onToggleReasonEnabled = () => {
    this.setState(({ reasonEnabled }) => ({ reasonEnabled: !reasonEnabled }));
  };

  onTSERequested = () => {
    const { onTSERequested, birthdate, name } = this.props;
    onTSERequested({ birthdate, name });
  };

  render() {
    const {
      birthdate,
      name,
      voteCard,
      saveErrors,
      isSaving,
      onOpenURL,
      onSubmit,
      onSetName,
      onSetBirthdate,
      onSetVoteCard,
    } = this.props;

    const { errors, reasonEnabled } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <SignUpBreadCrumb
              highlightId={2}
              containerStyle={styles.breadcrumb}
            />

            <Text style={styles.headerTitle}>{locale.profileSignUpTitle}</Text>

            <View>
              <TouchableOpacity
                onPress={this.enableReason}
                style={[styles.whyDocumentsContainer, styles.warningContainer]}>
                <MaterialCommunityIcons
                  name="alert-decagram"
                  size={24}
                  color={"#FFF"}
                />
                <Text style={styles.whyDocumentsText}>
                  {locale.whyRequestDocuments}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <MDTextInput
                placeholder={locale.name}
                value={name}
                onChangeText={onSetName}
                hasError={!!errorForField("name", saveErrors) || !!errors.name}
                error={errorForField("name", saveErrors) || errors.name}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={(ref) => (this.nameInput = ref)}
              />

              <DateInput
                placeholder={locale.birthdate}
                value={birthdate}
                onChangeDateText={onSetBirthdate}
                hasError={
                  !!errorForField("birthday", saveErrors) || !!errors.birthdate
                }
                error={
                  errorForField("birthday", saveErrors) || errors.birthdate
                }
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={(ref) => (this.birthInput = ref)}
              />

              <VoteCardInput
                value={voteCard}
                onChangeVoteCardText={onSetVoteCard}
                placeholder={locale.voteCard}
                hasError={
                  !!errorForField("voteidcard", saveErrors) || !!errors.voteCard
                }
                error={
                  errorForField("voteidcard", saveErrors) || errors.voteCard
                }
                hint="Ex: 0000.0000.0000"
                onSubmitEditing={() => this.cardInput.blur()}
                ref={(ref) => (this.cardInput = ref)}
              />
              <TouchableOpacity
                onPress={this.onTSERequested}
                style={styles.cantRememberVoteCardContainer}>
                <Text style={styles.cantRememberVoteCardText}>
                  {locale.cantRememberVoteCard}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <RoundedButton
                title={locale.continue}
                enabled={this.formEnabled}
                action={onSubmit}
                buttonStyle={styles.continueButton}
                titleStyle={styles.continueButtonTitle}
              />
            </View>

            <StaticFooter onOpenURL={onOpenURL} />

            <DocumentsReasonModal
              isVisible={reasonEnabled}
              onToggleReasonEnabled={this.onToggleReasonEnabled}
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

export default enhance(ProfileSignUpLayout);
