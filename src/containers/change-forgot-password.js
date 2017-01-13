import { connect } from "react-redux";

import ChangeForgotPasswordLayout from "../components/change-forgot-password-layout";

import {
  isChangingForgotPassword,
  getChangeForgotPasswordErrors,
} from "../selectors";

import {
  changeForgotPassword,
  navigateBack,
} from "../actions";

const mapStateToProps = state => ({
  errors: getChangeForgotPasswordErrors(state),
  isSaving: isChangingForgotPassword(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onResendCode: () => dispatch(navigateBack()),
  onSave: ({ code, password }) => dispatch(changeForgotPassword({ code, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeForgotPasswordLayout);
