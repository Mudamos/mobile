import { connect } from "react-redux";

import ChangeForgotPasswordLayout from "../components/change-forgot-password-layout";

import {
  isChangingForgotPassword,
  getChangeForgotPasswordErrors,
} from "../selectors";

import {
  changeForgotPassword,
  clearChangeForgotPasswordError,
  navigateBack,
} from "../actions";

const clearErrorsAndGoBack = dispatch => {
  dispatch(clearChangeForgotPasswordError());
  dispatch(navigateBack());
};

const mapStateToProps = state => ({
  errors: getChangeForgotPasswordErrors(state),
  isSaving: isChangingForgotPassword(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => clearErrorsAndGoBack(dispatch),
  onResendCode: () => clearErrorsAndGoBack(dispatch),
  onSave: ({ code, password }) => dispatch(changeForgotPassword({ code, password })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangeForgotPasswordLayout);
