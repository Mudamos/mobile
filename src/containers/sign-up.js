import Config from "react-native-config";

import { connect } from "react-redux";

import SignUpLayout from "../components/sign-up-layout";

import {
  extractNumbers,
} from "../utils";

import {
  clearProfileSaveErrors,
  facebookUserLogIn,
  navigate,
  openURL,
  profileSaveMain,
  signingPlip,
  signingUp,
} from "../actions";

import {
  isLoggingIn,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

const TERMS_OF_USE_URL = Config.MUDAMOS_WEB_API_URL + "/institucional/termos-de-uso";

const mapStateToProps = state => ({
  createErrors: profileSaveErrors(state),
  isCreating: isSavingProfile(state),
  isLoggingIn: isLoggingIn(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(signingUp(false));
    dispatch(signingPlip(null)); // Clear the user plip sign intention if they gave up
    dispatch(navigate("plipsNav"));
  },
  onCreate: ({ cpf, email, password, termsAccepted }) => {
    dispatch(profileSaveMain({
      cpf: extractNumbers(cpf),
      email,
      password,
      termsAccepted,
    }))
  },
  onFacebookLogin: () => dispatch(facebookUserLogIn()),
  onOpenURL: url => dispatch(openURL(url)),
  onSigningUp: () => dispatch(signingUp(true)),
  onTermsRequested: () => dispatch(openURL(TERMS_OF_USE_URL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpLayout);
