import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  SafeAreaView,
  Text,
  View,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import ChevronButton from "./chevron-button";
import MDTextInput from "./md-text-input";
import DateInput from "./date-input";
import ZipCodeInput from "./zip-code-input";
import NavigationBar from "./navigation-bar";
import Avatar from "./avatar";
import AvatarModel from "../models/image";
import RoundedButton from "./rounded-button";

import ImagePicker from "react-native-image-picker";

import locale from "../locales/pt-BR";

import {
  baseName,
  log,
  errorForField,
} from "../utils";

import styles from "../styles/profile-update-layout";


export default class ProfileUpdateLayout extends Component {
  state = {
    avatar: (this.props.previousAvatar && this.props.previousAvatar.url) ? { uri: this.props.previousAvatar.url } : null,
    birthdate: this.props.previousBirthdate,
    currentPassword: "",
    name: this.props.previousName,
    newPassword: "",
    zipCode: this.props.previousZipCode,
  };

  static propTypes = {
    errorsUpdatePassword: PropTypes.array,
    errorsUpdateProfile: PropTypes.array,
    isAppUser: PropTypes.bool,
    isSavingAvatar: PropTypes.bool,
    isSavingPassword: PropTypes.bool,
    isSavingProfile: PropTypes.bool,
    previousAvatar: PropTypes.instanceOf(AvatarModel),
    previousBirthdate: PropTypes.string,
    previousName: PropTypes.string,
    previousZipCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onRequestAvatarPermission: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  selectAvatar = () => {
    const { onRequestAvatarPermission } = this.props;

    onRequestAvatarPermission();

    ImagePicker.showImagePicker({
      title: locale.chooseAvatar,
      cancelButtonTitle: locale.cancel,
      takePhotoButtonTitle: locale.takePhoto,
      chooseFromLibraryButtonTitle: locale.openGallery,
      mediaType: "photo",
      previousUri: null,
      storageOptions: {
        skipBackup: true,
      },
      allowsEditing: true,
    }, response => {
      if (!response.uri) return;

      const uri = response.uri;
      const name = baseName(uri);
      log(uri, { tag: "avatar uri" });

      this.setState({
        avatar: {
          uri,
          name,
          contentType: "image/jpeg",
        },
      });
    });
  }

  get validProfileFields() {
    const { birthdate, name, zipCode } = this.state
    const { previousBirthdate, previousName, previousZipCode } = this.props;

    const validBirth = String(birthdate).length === 10;
    const validName = String(name).length > 0;
    const validZip = String(zipCode).length === 9;
    const diffValues = String(previousBirthdate) !== String(birthdate) || String(previousName) !== String(name) || String(previousZipCode) !== String(zipCode);

    return [
      validBirth,
      validName,
      validZip,
      diffValues,
    ].every(v => v);
  }

  get validAvatar() {
    return this.state.avatar && this.props.previousAvatar && this.state.avatar.uri !== this.props.previousAvatar.url && this.state.avatar.uri !== this.state.previousUri;
  }

  get validPassword() {
    const { currentPassword, newPassword } = this.state;

    const validCurrentPassword = String(currentPassword).length > 0;
    const validNewPassword = String(newPassword).length > 0;

    return [
      validCurrentPassword,
      validNewPassword,
    ].every(v => v);
  }

  get validForm() {
    return this.validProfileFields || this.validAvatar || this.validPassword
  }

  get formEnabled() {
    return this.validForm;
  }

  render() {
    const {
      errorsUpdatePassword,
      errorsUpdateProfile,
      isAppUser,
      isSavingProfile,
      isSavingAvatar,
      isSavingPassword,
    } = this.props;

    const { avatar } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView style={styles.container}>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>
              {locale.profileUpdateTitle}
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.avatarContainer}>
                <Avatar
                  onPress={this.selectAvatar}
                  source={avatar}
                  floatingText="alterar"
                />
              </View>

              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", errorsUpdateProfile)}
                error={errorForField("name", errorsUpdateProfile)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              <DateInput
                placeholder={locale.birthdate}
                value={this.state.birthdate}
                onChangeDateText={birthdate => this.setState({ birthdate })}
                hasError={!!errorForField("birthday", errorsUpdateProfile)}
                error={errorForField("birthday", errorsUpdateProfile)}
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={ref => this.birthInput = ref}
              />

              <ZipCodeInput
                value={this.state.zipCode}
                onChangeZipCodeText={zipCode => this.setState({zipCode})}
                placeholder={locale.zipCode}
                hasError={!!errorForField("zipcode", errorsUpdateProfile)}
                error={errorForField("zipcode", errorsUpdateProfile)}
                hint="Ex: 00000-000"
                onSubmitEditing={() => this.zipInput.blur()}
                ref={ref => this.zipInput = ref}
              />

              { isAppUser &&
                <View>
                  <MDTextInput
                    placeholder={locale.currentPassword}
                    value={this.state.currentPassword}
                    password={true}
                    autoCapitalize="none"
                    onChangeText={password => this.setState({ currentPassword: password })}
                    hasError={!!errorForField("currentPassword", errorsUpdatePassword)}
                    error={errorForField("currentPassword", errorsUpdatePassword)}
                    onSubmitEditing={() => this.currentPasswordInput.blur()}
                    ref={ref => this.currentPasswordInput = ref}
                  />

                  <MDTextInput
                    placeholder={locale.newPassword}
                    value={this.state.newPassword}
                    password={true}
                    autoCapitalize="none"
                    onChangeText={password => this.setState({ newPassword: password })}
                    hasError={!!errorForField("newPassword", errorsUpdatePassword)}
                    error={errorForField("newPassword", errorsUpdatePassword)}
                    onSubmitEditing={() => this.newPasswordInput.blur()}
                    ref={ref => this.newPasswordInput = ref}
                  />
                </View>
              }
            </View>

            <RoundedButton
              title={locale.save.toUpperCase()}
              enabled={this.formEnabled}
              action={this.onSubmit}
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonTitle}
            />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isSavingProfile || isSavingAvatar || isSavingPassword} />
      </SafeAreaView>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;
    return (
      <NavigationBar
        leftView={<ChevronButton onPress={onBack} direction="left"/>}
        middleView={<HeaderLogo />}
      />
    );
  }

  onSubmit = () => {
    const { avatar, birthdate, name, zipCode, currentPassword, newPassword } = this.state;
    const { onSave } = this.props;

    this.setState({ previousUri: avatar.uri });

    const profile = {
      avatar,
      birthdate,
      name,
      zipCode,
      currentPassword,
      newPassword,
    };

    const validations = {
      validAvatar: this.validAvatar,
      validProfileFields: this.validProfileFields,
      validPassword: this.validPassword,
    }

    onSave({ profile, validations });
  }
}
