import { connect } from "react-redux";

import ProfilePhoneLayout from "../components/profile-phone-layout";

import { extractNumbers, phoneMask } from "../utils";

import {
  sendPhoneValidation,
} from "../actions";

import {
  currentUser,
  isSendingPhoneValidation,
  profileSendPhoneValidationErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    isSending: isSendingPhoneValidation(state),
    phone: phoneMask(user && user.mobile.number || ""),
    sendErrors: profileSendPhoneValidationErrors(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onPhoneGiven: phone => dispatch(sendPhoneValidation({
    phone: extractNumbers(phone),
    shouldNavigate: true,
  })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePhoneLayout);
