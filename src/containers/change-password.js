import { connect } from "react-redux";

import ChangePasswordLayout from "../components/change-password-layout";

import {
  changePassword,
  clearChangePasswordError,
  navigateBack,
} from "../actions";

import {
  isChangingPassword,
  getChangePasswordErrors,
} from "../selectors";


const mapStateToProps = state => ({
  errors: getChangePasswordErrors(state),
  isSaving: isChangingPassword(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearChangePasswordError());
    dispatch(navigateBack());
  },
  onSave: ({ currentPassword, newPassword }) => dispatch(changePassword({ currentPassword, newPassword })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordLayout);
