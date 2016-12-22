import { connect } from "react-redux";

import ProfilePhoneLayout from "../components/profile-phone-layout";

import { extractNumbers, phoneMask } from "../utils";

import {
  savePhone,
  sendPhoneValidation,
} from "../actions";

import {
  currentUser,
  hasSentPhoneValidation,
  isSavingProfile,
  isSendingPhoneValidation,
  profileSendPhoneValidationErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    hasSentValidation: hasSentPhoneValidation(state),
    isVerifying: isSavingProfile(state),
    isSending: isSendingPhoneValidation(state),
    phone: phoneMask(user && user.mobile.number || ""),
    sendErrors: profileSendPhoneValidationErrors(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onPhoneGiven: phone => dispatch(sendPhoneValidation(extractNumbers(phone))),
  onVerifyCode: ({ code, phone }) => dispatch(savePhone({ phone: extractNumbers(phone), code })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhoneLayout);
