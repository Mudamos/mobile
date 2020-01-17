import { connect } from "react-redux";

import ProfileUpdateLayout from "../components/profile-update-layout";

import {
  currentUser,
  findCities,
  findStates,
  getChangePasswordErrors,
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
  requestAvatarAccess,
} from "../actions";

import {
  extractNumbers,
  fromISODate,
  toISODate,
  zipCodeMask,
} from "../utils";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
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
    previousBirthdate: user && user.birthdate ? fromISODate(user.birthdate) : null,
    previousUf: user && user.voteCity ? user.voteCity.uf : null,
    previousZipCode: user && user.zipCode ? zipCodeMask(user.zipCode) : null,
    states: findStates(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(navigateBack());
  },
  onFetchCities: () => dispatch(fetchCities()),
  onFetchStates: () => dispatch(fetchStates()),
  onSave: ({ profile, validations }) => dispatch(
    updateUser({
      profile: {
        ...profile,
        birthdate: toISODate(profile.birthdate),
        zipCode: extractNumbers(profile.zipCode),
      },
      validations,
    })),
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdateLayout);
