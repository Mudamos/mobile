import { connect } from "react-redux";

import SignUpLayout from "../components/sign-up-layout";

import {
  facebookUserLogIn,
  navigate,
  navigateBack,
  profileSaveMain,
} from "../actions";

import {
  isLoggingIn,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => ({
  createErrors: profileSaveErrors(state),
  isCreating: isSavingProfile(state),
  isLoggingIn: isLoggingIn(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onCreate: ({ name, email, password }) => dispatch(profileSaveMain({ name, email, password })),
  onFacebookLogin: () => dispatch(facebookUserLogIn()),
  onSignIn: () => dispatch(navigate("signIn")),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpLayout);
