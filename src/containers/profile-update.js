import { connect } from "react-redux";

import ProfileUpdateLayout from "../components/profile-update-layout";

import {
  currentUser,
  getChangePasswordErrors,
  isChangingPassword,
  isSavingAvatar,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

import {
  clearProfileSaveErrors,
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
    errorsUpdatePassword: getChangePasswordErrors(state),
    errorsUpdateProfile: profileSaveErrors(state),
    isSavingAvatar: isSavingAvatar(state),
    isSavingPassword: isChangingPassword(state),
    isSavingProfile: isSavingProfile(state),
    previousAvatar: user ? user.avatar : null,
    previousName: user ? user.name : null,
    previousBirthdate: user && user.birthdate ? fromISODate(user.birthdate) : null,
    previousZipCode: user && user.zipCode ? zipCodeMask(user.zipCode) : null,
  };
};

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(navigateBack());
  },
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
