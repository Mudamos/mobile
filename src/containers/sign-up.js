import { connect } from "react-redux";

import SignUpLayout from "../components/sign-up-layout";

import {
  profileSaveMain
} from "../actions";

import {
  isUserLoggedIn,
  isSavingProfile,
  currentUser,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    previousName: user ? user.name : null,
    errors: profileSaveErrors(state),
    showEmail: !user || !user.email,
    showPassword: !isUserLoggedIn(state),
    isSaving: isSavingProfile(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onSave: ({ name, email, password }) => dispatch(profileSaveMain({ name, email, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpLayout);
