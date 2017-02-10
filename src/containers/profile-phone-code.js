import { connect } from "react-redux";

import ProfilePhoneCodeLayout from "../components/profile-phone-code-layout";

import {
  navigateBack,
  phoneJustValidated,
  profileStateMachine,
  savePhone,
  sendPhoneValidation,
} from "../actions";

import {
  isSavingProfile,
  isSendingPhoneValidation,
  wasPhoneValidated,
} from "../selectors";


const mapStateToProps = state => ({
  isResending: isSendingPhoneValidation(state),
  isValidated: wasPhoneValidated(state),
  isVerifying: isSavingProfile(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onResend: phone => dispatch(sendPhoneValidation({ phone })),
  onSignUpFinish: () => {
    dispatch(phoneJustValidated(false));
    dispatch(profileStateMachine());
  },
  onVerifyCode: ({ code, phone }) => dispatch(savePhone({ phone, code })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhoneCodeLayout);
