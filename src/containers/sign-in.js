import { connect } from "react-redux";

import SignInLayout from "../components/sign-in-layout";

import {
  authErrorCode,
  isFacebookLoggedIn,
  isLoggingIn,
  currentUser,
} from "../selectors";

import {
  appleSignIn,
  actionSignerReset,
  clearAuthLoginError,
  facebookUserLogIn,
  loginUser,
  navigate,
  navigateBack,
  openURL,
  signingUp,
} from "../actions";

const mapStateToProps = (state) => {
  return {
    isLoggingIn: isLoggingIn(state),
    isLogged: !!currentUser(state),
    isFacebookLogged: isFacebookLoggedIn(state),
    authErrorCode: authErrorCode(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onAppleSignIn: () => dispatch(appleSignIn()),
  onBack: () => {
    dispatch(signingUp(false));
    dispatch(actionSignerReset());
    dispatch(navigateBack());
  },
  onClearAuthLoginError: () => dispatch(clearAuthLoginError()),
  onFacebookLogin: () => dispatch(facebookUserLogIn()),
  onForgotPassword: () => dispatch(navigate("forgotPassword")),
  onOpenURL: (url) => dispatch(openURL(url)),
  onSignUp: () => {
    dispatch(signingUp(true));
    dispatch(navigate("signUp"));
  },
  onSignIn: (email, password) => {
    dispatch(signingUp(false));
    dispatch(loginUser(email, password));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInLayout);
