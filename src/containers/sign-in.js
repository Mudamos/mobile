import { connect } from "react-redux";

import SignInLayout from "../components/sign-in-layout";

import {
  isLoggingIn,
} from "../selectors";

import {
  facebookUserLogIn,
  loginUser,
  navigate,
  navigateBack,
  openURL,
} from "../actions";

const mapStateToProps = state => ({
  isLoggingIn: isLoggingIn(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onFacebookLogin: () => dispatch(facebookUserLogIn()),
  onForgotPassword: () => dispatch(navigate("forgotPassword")),
  onOpenURL: url => dispatch(openURL(url)),
  onSignUp: () => dispatch(navigate("signUp")),
  onSignIn: (email, password) => dispatch(loginUser(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayout);
