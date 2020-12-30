import { connect } from "react-redux";

import React from "react";
import ProfileUpdateLayout from "../components/profile-update-layout";
import {
  ActionSheetProvider,
  connectActionSheet,
} from "@expo/react-native-action-sheet";

import {
  currentUser,
  findCities,
  findStates,
  getChangePasswordErrors,
  getCurrentAuthorizedPermission,
  isChangingPassword,
  isSavingAvatar,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

import {
  clearProfileSaveErrors,
  fetchCities,
  fetchStates,
  updateUser,
  navigateBack,
  requestCameraAccess,
  requestGalleryAccess,
} from "../actions";

import { compose } from "recompose";

import { connectPermissionService } from "../providers/permisson-provider";

import { extractNumbers, fromISODate, toISODate, zipCodeMask } from "../utils";

const Layout = connectActionSheet(ProfileUpdateLayout);

const Container = (props) => (
  <ActionSheetProvider>
    <Layout {...props} />
  </ActionSheetProvider>
);

const mapStateToProps = (state) => {
  const user = currentUser(state);

  return {
    authorizedPermission: getCurrentAuthorizedPermission(state),
    cities: findCities(state),
    errorsUpdatePassword: getChangePasswordErrors(state),
    errorsUpdateProfile: profileSaveErrors(state),
    isAppUser: user ? user.isAppUser : null,
    isSavingAvatar: isSavingAvatar(state),
    isSavingPassword: isChangingPassword(state),
    isSavingProfile: isSavingProfile(state),
    previousAvatar: user ? user.avatar : null,
    previousCity: user ? user.voteCity : null,
    previousName: user ? user.name : null,
    previousBirthdate:
      user && user.birthdate ? fromISODate(user.birthdate) : null,
    previousUf: user && user.voteCity ? user.voteCity.uf : null,
    previousZipCode: user && user.zipCode ? zipCodeMask(user.zipCode) : null,
    states: findStates(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(navigateBack());
  },
  onFetchCities: () => dispatch(fetchCities()),
  onFetchStates: () => dispatch(fetchStates()),
  onSave: ({ profile, validations }) =>
    dispatch(
      updateUser({
        profile: {
          ...profile,
          birthdate: toISODate(profile.birthdate),
          zipCode: extractNumbers(profile.zipCode),
        },
        validations,
      }),
    ),
  onRequestCameraPermission: () => dispatch(requestCameraAccess()),
  onRequestGalleryPermission: () => dispatch(requestGalleryAccess()),
});

const enhance = compose(
  connectPermissionService,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Container);
