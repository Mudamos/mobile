import { connect } from "react-redux";

import SignUpLayout from "../components/sign-up-layout";

import {
  profileSaveMain
} from "../actions";

import {
  isFacebookLoggedIn,
  isSavingProfile,
  currentUser,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    currentUser: user,
    errors: profileSaveErrors(state),
    showEmail: !user || !user.email,
    showPassword: !isFacebookLoggedIn(state),
    isSaving: isSavingProfile(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onSave: ({ name, email, password }) => dispatch(profileSaveMain({ name, email, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpLayout);
