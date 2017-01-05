import { connect } from "react-redux";

import SignInLayout from "../components/sign-in-layout";

import {
  isLoggingIn,
} from "../selectors";

import {
  loginUser,
  navigateBack,
} from "../actions";

const mapStateToProps = state => ({
  isLoggingIn: isLoggingIn(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onSignIn: (email, password) => dispatch(loginUser(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayout);
