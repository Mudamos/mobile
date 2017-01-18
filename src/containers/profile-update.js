import { connect } from "react-redux";

import ProfileUpdateLayout from "../components/profile-update-layout";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

import {
  clearProfileSaveErrors,
  navigateBack,
  profileUpdate,
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
    errors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
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
  onSave: ({ birthdate, name, zipCode }) =>
    dispatch(profileUpdate({
      birthdate: toISODate(birthdate),
      name,
      zipCode: extractNumbers(zipCode),
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdateLayout);
