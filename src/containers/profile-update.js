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
  changePassword,
  clearProfileSaveErrors,
  navigateBack,
  profileUpdate,
  requestAvatarAccess,
  profileSaveAvatar,
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
  onRequestAvatarPermission: () => dispatch(requestAvatarAccess()),
  onSaveProfile: ({ birthdate, name, zipCode }) =>
    dispatch(profileUpdate({
      birthdate: toISODate(birthdate),
      name,
      zipCode: extractNumbers(zipCode),
    })),
  onSaveAvatar: ({ avatar }) => dispatch(profileSaveAvatar({ avatar })),
  onSavePassword: ({ currentPassword, newPassword }) => dispatch(changePassword({ currentPassword, newPassword })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdateLayout);
