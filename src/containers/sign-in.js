import { connect } from "react-redux";

import SignInLayout from "../components/sign-in-layout";

import {
  currentFacebookUser,
  currentAuthToken,
  isLoggingIn,
} from "../selectors";

import {
  facebookUserLoggedIn,
  facebookLogInError,
  loginUser,
  logout,
} from "../actions";

const facebookPermissions = ["public_profile", "email"];

const mapStateToProps = state => ({
  facebookUser: currentFacebookUser(state),
  isLoggingIn: isLoggingIn(state),
  currentAuthToken: currentAuthToken(state),
  facebookPermissions,
});

const mapDispatchToProps = dispatch => ({
  onFacebookLogin: data => dispatch(facebookUserLoggedIn(data)),
  onFacebookError: data => dispatch(facebookLogInError(data)),
  onLogout: () => dispatch(logout()),
  onSignIn: (email, password) => dispatch(loginUser(email, password)),
  onSignUp: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayout);
