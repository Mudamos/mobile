import { connect } from "react-redux";

import ProfileSignUpLayout from "../components/profile-sign-up-layout";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

import {
  clearProfileSaveErrors,
  navigate,
  openURL,
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
    dispatch(navigate("plipsNav"));
  },
  onSave: ({ birthdate, name, voteCard }) => {
    dispatch(profileUpdate({
      birthdate: toISODate(birthdate),
      name,
      voteIdCard: extractNumbers(voteCard),
    }));
    dispatch(navigate("profileAddress"));
  },
  onOpenURL: url => dispatch(openURL(url)),
  onTSERequested: () => dispatch(navigate("tse")),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSignUpLayout);
