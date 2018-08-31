import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import BackButton from "./chevron-button";
import MDTextInput from "./md-text-input";
import FlatButton from "./flat-button";
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
  errorForField
} from "../utils";

import styles from "../styles/profile-update-layout";


export default class ProfileUpdateLayout extends Component {
  state = {
    avatar: this.props.previousAvatar.url ? { uri: this.props.previousAvatar.url } : null,
    birthdate: this.props.previousBirthdate,
    currentPassword: "",
    name: this.props.previousName,
    newPassword: "",
    zipCode: this.props.previousZipCode,
  };

  static propTypes = {
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    previousAvatar: PropTypes.instanceOf(AvatarModel),
    previousBirthdate: PropTypes.string,
    previousName: PropTypes.string,
    previousZipCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  selectAvatar = () => {
    ImagePicker.showImagePicker({
      title: locale.chooseAvatar,
      cancelButtonTitle: locale.cancel,
      takePhotoButtonTitle: locale.takePhoto,
      chooseFromLibraryButtonTitle: locale.openGallery,
      mediaType: "photo",
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

  get validForm() {
    const validBirth = String(this.state.birthdate).length === 10;
    const validName = String(this.state.name).length > 0;
    const validZip = String(this.state.zipCode).length === 9;

    const validAvatar = this.state.avatar.uri !== this.props.previousAvatar.url;
    const validCommonFields = [ validBirth, validName, validZip ].every(v => v);
    const validPassword = this.state.newPassword.length > 0;

    return validAvatar || validCommonFields || validPassword
  }

  get formEnabled() {
    return this.validForm;
  }

  render() {
    const {
      errors,
      isSaving,
    } = this.props;

    const { avatar } = this.state;

    return (
      <View style={styles.container}>
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
                  editText={true}
                />
              </View>

              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={name => this.setState({ name })}
                hasError={!!errorForField("name", errors)}
                error={errorForField("name", errors)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={ref => this.nameInput = ref}
              />

              <DateInput
                placeholder={locale.birthdate}
                value={this.state.birthdate}
                onChangeDateText={birthdate => this.setState({ birthdate })}
                hasError={!!errorForField("birthday", errors)}
                error={errorForField("birthday", errors)}
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={ref => this.birthInput = ref}
              />

              <ZipCodeInput
                value={this.state.zipCode}
                onChangeZipCodeText={zipCode => this.setState({zipCode})}
                placeholder={locale.zipCode}
                hasError={!!errorForField("zipcode", errors)}
                error={errorForField("zipcode", errors)}
                hint="Ex: 00000-000"
                onSubmitEditing={() => this.zipInput.blur()}
                ref={ref => this.zipInput = ref}
              />

              <MDTextInput
                placeholder={locale.currentPassword}
                value={this.state.currentPassword}
                password={true}
                autoCapitalize="none"
                onChangeText={password => this.setState({ currentPassword: password })}
                onSubmitEditing={() => this.currentPasswordInput.blur()}
                ref={ref => this.currentPasswordInput = ref}
              />

              <MDTextInput
                placeholder={locale.newPassword}
                value={this.state.newPassword}
                password={true}
                autoCapitalize="none"
                onChangeText={password => this.setState({ newPassword: password })}
                onSubmitEditing={() => this.newPasswordInput.blur()}
                ref={ref => this.newPasswordInput = ref}
              />
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

  onSubmit = () => {
    const { birthdate, name, zipCode } = this.state;
    const { onSave } = this.props;

    onSave({ birthdate, name, zipCode });
  }
}
