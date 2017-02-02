import { connect } from "react-redux";

import ProfilePhoneLayout from "../components/profile-phone-layout";

import { extractNumbers, phoneMask } from "../utils";

import {
  phoneJustValidated,
  phoneValidationSent,
  profileStateMachine,
  savePhone,
  sendPhoneValidation,
} from "../actions";

import {
  currentUser,
  hasSentPhoneValidation,
  isSavingProfile,
  isSendingPhoneValidation,
  profileSendPhoneValidationErrors,
  wasPhoneValidated,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    hasSentValidation: hasSentPhoneValidation(state),
    isValidated: wasPhoneValidated(state),
    isVerifying: isSavingProfile(state),
    isSending: isSendingPhoneValidation(state),
    phone: phoneMask(user && user.mobile.number || ""),
    sendErrors: profileSendPhoneValidationErrors(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onPhoneGiven: phone => dispatch(sendPhoneValidation(extractNumbers(phone))),
  onSignUpFinish: () => {
    dispatch(phoneJustValidated(false));
    dispatch(phoneValidationSent(false));
    dispatch(profileStateMachine());
  },
  onVerifyCode: ({ code, phone }) => dispatch(savePhone({ phone: extractNumbers(phone), code })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhoneLayout);
