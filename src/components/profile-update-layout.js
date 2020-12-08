import PropTypes from "prop-types";
import React, { Component } from "react";

import { Text, View } from "react-native";

import { curry, filter, propEq, cond, T, equals, identity } from "ramda";

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
import SafeAreaView from "./safe-area-view";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import locale from "../locales/pt-BR";

import { baseName, filterDataByTerm, log, errorForField } from "../utils";

import { AUTHORIZED } from "../services/permission";
import { PermissionShape } from "../providers/permisson-provider";

import { CityType, StateUfType } from "../prop-types";

import styles from "../styles/profile-update-layout";

const formatState = (state) => state && `${state.name} - ${state.uf}`;
const formatCity = (city) => city && city.name;

const findPreviousCity = (city, collection) =>
  !city ? null : collection.find(propEq("id", city.id));

const findPreviousState = (uf, collection) =>
  !uf ? null : collection.find(propEq("uf", uf.toUpperCase()));

const byUf = curry((uf, collection) => filter(propEq("uf", uf))(collection));

const sheetOptions = [locale.takePhoto, locale.openGallery, locale.cancel];
const cameraIndexSheetIndex = 0;
const gallerySheetIndexSheetIndex = 1;
const cancelButtonSheetIndex = 2;

const mediaOptions = {
  mediaType: "photo",
};

export default class ProfileUpdateLayout extends Component {
  state = {
    avatar:
      this.props.previousAvatar && this.props.previousAvatar.url
        ? { uri: this.props.previousAvatar.url }
        : null,
    birthdate: this.props.previousBirthdate,
    citySearchTerm: "",
    currentPassword: "",
    errors: {},
    filteredCities: this.props.previousUf
      ? byUf(this.props.previousUf, this.props.cities)
      : [],
    filteredStates: this.props.states,
    mainScrollViewOffset: null,
    name: this.props.previousName,
    newPassword: "",
    selectedCity: findPreviousCity(this.props.previousCity, this.props.cities),
    selectedState: findPreviousState(this.props.previousUf, this.props.states),
    scopedCities: this.props.previousUf
      ? byUf(this.props.previousUf, this.props.cities)
      : [],
    ufSearchTerm: "",
    zipCode: this.props.previousZipCode,
  };

  static propTypes = {
    authorizedPermission: PropTypes.string,
    cities: PropTypes.arrayOf(CityType).isRequired,
    errorsUpdatePassword: PropTypes.array,
    errorsUpdateProfile: PropTypes.array,
    isAppUser: PropTypes.bool,
    isSavingAvatar: PropTypes.bool,
    isSavingPassword: PropTypes.bool,
    isSavingProfile: PropTypes.bool,
    permission: PermissionShape.isRequired,
    previousAvatar: PropTypes.instanceOf(AvatarModel),
    previousBirthdate: PropTypes.string,
    previousCity: CityType,
    previousName: PropTypes.string,
    previousUf: PropTypes.string,
    previousZipCode: PropTypes.string,
    showActionSheetWithOptions: PropTypes.func.isRequired,
    states: PropTypes.arrayOf(StateUfType).isRequired,
    onBack: PropTypes.func.isRequired,
    onFetchCities: PropTypes.func.isRequired,
    onFetchStates: PropTypes.func.isRequired,
    onRequestCameraPermission: PropTypes.func.isRequired,
    onRequestGalleryPermission: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  cityInput = React.createRef();
  mainScrollView = React.createRef();
  ufInput = React.createRef();

  componentDidUpdate(prevProps) {
    const { authorizedPermission } = this.props;

    if (
      authorizedPermission &&
      authorizedPermission !== prevProps.authorizedPermission
    ) {
      this.continueAvatarFlow(authorizedPermission);
    }
  }

  isPermissionGranted = (permission) =>
    this.props.permission.service
      .checkStatus(permission)
      .then(equals(AUTHORIZED));

  continueAvatarFlow = (authorizedPermission) => {
    const {
      permission: { service },
    } = this.props;

    cond([
      [
        equals(service.permissions.camera),
        () => {
          launchCamera(mediaOptions, this.onImageResult);
        },
      ],
      [
        equals(service.permissions.photo),
        () => {
          launchImageLibrary(mediaOptions, this.onImageResult);
        },
      ],
    ])(authorizedPermission);
  };

  onImageResult = ({ didCancel, errorCode, uri }) => {
    log({ didCancel, errorCode }, { tag: "avatar" });

    if (didCancel || !uri) return;

    const name = baseName(uri);
    log(uri, { tag: "avatar" }, { errorCode });

    this.setState({
      avatar: {
        uri,
        name,
        contentType: "image/jpeg",
      },
    });
  };

  selectAvatar = () => {
    const {
      onRequestCameraPermission,
      onRequestGalleryPermission,
      showActionSheetWithOptions,
      permission: { service },
    } = this.props;

    showActionSheetWithOptions(
      {
        options: sheetOptions,
        cancelButtonIndex: cancelButtonSheetIndex,
      },
      (buttonIndex) => {
        log("Sheet index", { tag: "Sheet" }, { buttonIndex });

        cond([
          [
            equals(cameraIndexSheetIndex),
            async () => {
              const isGranted = await this.isPermissionGranted(
                service.permissions.camera,
              );

              log({ isGranted }, { tag: "camera" });

              if (isGranted) {
                this.continueAvatarFlow(service.permissions.camera);
              } else {
                onRequestCameraPermission();
              }
            },
          ],
          [
            equals(gallerySheetIndexSheetIndex),
            async () => {
              const isGranted = await this.isPermissionGranted(
                service.permissions.photo,
              );

              log({ isGranted }, { tag: "photo" });

              if (isGranted) {
                this.continueAvatarFlow(service.permissions.photo);
              } else {
                onRequestGalleryPermission();
              }
            },
          ],
          [T, identity],
        ])(buttonIndex);
      },
    );
  };

  get validProfileFields() {
    const { birthdate, name, zipCode } = this.state;
    const { previousBirthdate, previousName, previousZipCode } = this.props;

    const validBirth = String(birthdate).length === 10;
    const validName = String(name).length > 0;
    const validZip = String(zipCode).length === 9;
    const diffValues =
      String(previousBirthdate) !== String(birthdate) ||
      String(previousName) !== String(name) ||
      String(previousZipCode) !== String(zipCode);

    return [validBirth, validName, validZip, diffValues].every((v) => v);
  }

  get validAvatar() {
    return (
      this.state.avatar &&
      this.props.previousAvatar &&
      this.state.avatar.uri !== this.props.previousAvatar.url &&
      this.state.avatar.uri !== this.state.previousUri
    );
  }

  get validPassword() {
    const { currentPassword, newPassword } = this.state;

    const validCurrentPassword = String(currentPassword).length > 0;
    const validNewPassword = String(newPassword).length > 0;

    return [validCurrentPassword, validNewPassword].every((v) => v);
  }

  get validForm() {
    return this.validProfileFields || this.validAvatar || this.validPassword;
  }

  get formEnabled() {
    return this.validForm;
  }

  onMainScroll = ({ nativeEvent: { contentOffset } }) =>
    this.setState({ mainScrollViewOffset: contentOffset });

  onChangeUfSearch = (ufSearchTerm) => {
    const { states } = this.props;

    this.setState({
      citySearchTerm: "",
      selectedCity: null,
      selectedState: null,
      ufSearchTerm,
      filteredStates: filterDataByTerm(ufSearchTerm, formatState, states),
      scopedCities: [],
      filteredCities: [],
    });
  };

  onChangeCitySearch = (citySearchTerm) => {
    this.setState(({ scopedCities }) => ({
      selectedCity: null,
      citySearchTerm,
      filteredCities: filterDataByTerm(
        citySearchTerm,
        formatCity,
        scopedCities,
      ),
    }));
  };

  onFocusSelectField = () => {
    setTimeout(() => {
      const { mainScrollViewOffset } = this.state;

      if (mainScrollViewOffset) {
        this.mainScrollView.current.scrollTo({
          x: 0,
          y: mainScrollViewOffset.y + 60,
        });
      }
    }, 100);
  };

  onSetUf = (selectedState) => {
    const { cities } = this.props;

    const scopedCities = byUf(selectedState.uf, cities);

    this.setState({
      citySearchTerm: "",
      selectedCity: null,
      selectedState,
      scopedCities,
      filteredCities: scopedCities,
    });

    this.ufInput.current.blur();
  };

  onSetCity = (selectedCity) => {
    this.setState({ selectedCity });
    this.cityInput.current.blur();
  };

  onUfSubmitEditing = () => {
    const { states } = this.props;
    const { selectedState } = this.state;

    this.ufInput.current.blur();

    if (!selectedState) {
      this.setState({ ufSearchTerm: "", filteredStates: states });
    }
  };

  onCitySubmitEditing = () => {
    const { selectedCity } = this.state;

    this.cityInput.current.blur();

    if (!selectedCity) {
      this.setState(({ scopedCities }) => ({
        citySearchTerm: "",
        filteredCities: scopedCities,
      }));
    }
  };

  renderUfSearchResult = ({ item: state }) => {
    return <Text style={styles.resultText}>{formatState(state)}</Text>;
  };

  renderCitySearchResult = ({ item: city }) => {
    return <Text style={styles.resultText}>{formatCity(city)}</Text>;
  };

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
          <ScrollView
            ref={this.mainScrollView}
            onScroll={this.onMainScroll}
            scrollEventThrottle={16}>
            {this.renderNavBar()}

            <Text style={styles.headerTitle}>{locale.profileUpdateTitle}</Text>

            <View style={styles.inputContainer}>
              <View style={styles.avatarContainer}>
                <Avatar
                  onPress={this.selectAvatar}
                  source={avatar}
                  avatarStyle={styles.avatar}>
                  <Text style={styles.avatarText}>alterar</Text>
                </Avatar>
              </View>

              <MDTextInput
                placeholder={locale.name}
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
                hasError={!!errorForField("name", errorsUpdateProfile)}
                error={errorForField("name", errorsUpdateProfile)}
                onSubmitEditing={() => this.nameInput.blur()}
                ref={(ref) => (this.nameInput = ref)}
              />

              <DateInput
                placeholder={locale.birthdate}
                value={this.state.birthdate}
                onChangeDateText={(birthdate) => this.setState({ birthdate })}
                hasError={!!errorForField("birthday", errorsUpdateProfile)}
                error={errorForField("birthday", errorsUpdateProfile)}
                hint="Ex: 31/12/1980"
                onSubmitEditing={() => this.birthInput.blur()}
                ref={(ref) => (this.birthInput = ref)}
              />

              <ZipCodeInput
                value={this.state.zipCode}
                onChangeZipCodeText={(zipCode) => this.setState({ zipCode })}
                placeholder={locale.zipCode}
                hasError={!!errorForField("zipcode", errorsUpdateProfile)}
                error={errorForField("zipcode", errorsUpdateProfile)}
                hint="Ex: 00000-000"
                onSubmitEditing={() => this.zipInput.blur()}
                ref={(ref) => (this.zipInput = ref)}
              />

              {isAppUser && (
                <View>
                  <MDTextInput
                    placeholder={locale.currentPassword}
                    value={this.state.currentPassword}
                    password={true}
                    autoCapitalize="none"
                    onChangeText={(password) =>
                      this.setState({ currentPassword: password })
                    }
                    hasError={
                      !!errorForField("currentPassword", errorsUpdatePassword)
                    }
                    error={errorForField(
                      "currentPassword",
                      errorsUpdatePassword,
                    )}
                    onSubmitEditing={() => this.currentPasswordInput.blur()}
                    ref={(ref) => (this.currentPasswordInput = ref)}
                  />

                  <MDTextInput
                    placeholder={locale.newPassword}
                    value={this.state.newPassword}
                    password={true}
                    autoCapitalize="none"
                    onChangeText={(password) =>
                      this.setState({ newPassword: password })
                    }
                    hasError={
                      !!errorForField("newPassword", errorsUpdatePassword)
                    }
                    error={errorForField("newPassword", errorsUpdatePassword)}
                    onSubmitEditing={() => this.newPasswordInput.blur()}
                    ref={(ref) => (this.newPasswordInput = ref)}
                  />
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <RoundedButton
                title={locale.save.toUpperCase()}
                enabled={this.formEnabled}
                action={this.onSubmit}
                buttonStyle={styles.submitButton}
                titleStyle={styles.submitButtonTitle}
              />
            </View>
          </ScrollView>
        </Layout>

        <PageLoader
          isVisible={isSavingProfile || isSavingAvatar || isSavingPassword}
        />
      </SafeAreaView>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;
    return (
      <NavigationBar
        leftView={<ChevronButton onPress={onBack} direction="left" />}
        middleView={<HeaderLogo />}
      />
    );
  }

  onSubmit = () => {
    const {
      avatar,
      birthdate,
      name,
      zipCode,
      currentPassword,
      newPassword,
    } = this.state;
    const { onSave } = this.props;

    this.setState({ errors: {}, previousUri: avatar.uri });

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
    };

    onSave({ profile, validations });
  };
}
