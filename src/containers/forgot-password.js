import { connect } from "react-redux";

import ForgotPasswordLayout from "../components/forgot-password-layout";

import {
  isRetrievingPassword,
} from "../selectors";

import {
  navigate,
  navigateBack,
  retrievePassword,
} from "../actions";

const mapStateToProps = state => ({
  isSaving: isRetrievingPassword(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onHasCode: () => dispatch(navigate("changeForgotPassword")),
  onSave: email => dispatch(retrievePassword(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordLayout);
