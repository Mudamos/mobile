import { connect } from "react-redux";

import SignUpLayout from "../components/sign-up-layout";

import {
  navigate,
  profileSaveMain,
} from "../actions";

import {
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => ({
  createErrors: profileSaveErrors(state),
  isCreating: isSavingProfile(state),
});

const mapDispatchToProps = dispatch => ({
  onCreate: ({ name, email, password }) => dispatch(profileSaveMain({ name, email, password })),
  onSignIn: () => dispatch(navigate("signIn")),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpLayout);
