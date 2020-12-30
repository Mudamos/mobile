export const sendVotePhoneConfirmation = ({
  goBackToScreenKey,
  phone,
  plip,
}) => ({
  type: "VOTE_CONFIRMATION_SEND_PHONE",
  payload: { goBackToScreenKey, phone, plip },
});

export const sendVotePhoneConfirmationSuccess = () => ({
  type: "VOTE_CONFIRMATION_SEND_PHONE_SUCCESS",
});

export const sendVotePhoneConfirmationError = (error) => ({
  type: "VOTE_CONFIRMATION_SEND_PHONE_ERROR",
  payload: { error },
});

export const sendVoteCodeConfirmation = ({
  goBackToScreenKey,
  phone,
  pinCode,
  plip,
}) => ({
  type: "VOTE_CONFIRMATION_SEND_CODE",
  payload: { goBackToScreenKey, phone, pinCode, plip },
});

export const sendVoteCodeConfirmationSuccess = () => ({
  type: "VOTE_CONFIRMATION_SEND_CODE_SUCCESS",
});

export const sendVoteCodeConfirmationError = (error) => ({
  type: "VOTE_CONFIRMATION_SEND_CODE_ERROR",
  payload: { error },
});

export const voteCodeConfirmationDismiss = ({ goBackToScreenKey }) => ({
  type: "VOTE_CONFIRMATION_DISMISS",
  payload: { goBackToScreenKey },
});
