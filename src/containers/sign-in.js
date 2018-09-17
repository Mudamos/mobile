import { connect } from "react-redux";

import SignInLayout from "../components/sign-in-layout";

import {
  authErrorCode,
  isFacebookLoggedIn,
  isLoggingIn,
  currentUser,
} from "../selectors";

import {
  clearAuthLoginError,
  facebookUserLogIn,
  loginUser,
  navigate,
  navigateBack,
  openURL,
} from "../actions";

const mapStateToProps = state => {
  return {
    isLoggingIn: isLoggingIn(state),
    isLogged: !!currentUser(state),
    isFacebookLogged: isFacebookLoggedIn(state),
    authErrorCode: authErrorCode(state),
  };
}

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onClearAuthLoginError: () => dispatch(clearAuthLoginError()),
  onFacebookLogin: () => dispatch(facebookUserLogIn()),
  onForgotPassword: () => dispatch(navigate("forgotPassword")),
  onOpenURL: url => dispatch(openURL(url)),
  onSignUp: () => dispatch(navigate("signUp")),
  onSignIn: (email, password) => dispatch(loginUser(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayout);
