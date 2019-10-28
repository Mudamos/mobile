export const fetchProfile = () => ({
  type: "PROFILE_FETCH",
});

export const fetchingProfileError = profileFetchError => ({
  type: "PROFILE_FETCHING_ERROR",
  payload: { profileFetchError },
});

export const isFetchingProfile = isFetching => ({
  type: "PROFILE_FETCHING",
  payload: { isFetching },
});

export const profileSaveMain = ({ cpf, email, password, termsAccepted }) => ({
  type: "PROFILE_SAVE_MAIN",
  payload: { cpf, email, password, termsAccepted },
});

export const saveProfileBirthdate = birthdate => ({
  type: "PROFILE_SAVE_BIRTH_DATE",
  payload: { birthdate },
});

export const saveProfileDocuments = ({ cpf, voteCard, termsAccepted }) => ({
  type: "PROFILE_SAVE_DOCUMENTS",
  payload: { cpf, voteCard, termsAccepted },
});

export const savingProfile = isSaving => ({
  type: "PROFILE_SAVING",
  payload: { isSaving },
});

export const signingUp = isSigningUp => ({
  type: "SIGNING_UP",
  payload: { isSigningUp },
});

export const sendingPhoneValidation = isSendingValidation => ({
  type: "PROFILE_SENDING_PHONE_VALIDATION",
  payload: { isSendingValidation },
});

export const updatedUserProfile = ({ user }) => ({
  type: "PROFILE_USER_UPDATED",
  payload: { currentUser: user },
});

export const saveUserProfileError = error => ({
  type: "PROFILE_USER_SAVE_FAILURE",
  payload: { error },
});

export const saveZipCode = location => ({
  type: "PROFILE_SAVE_ZIP_CODE",
  payload: { location },
});

export const saveVoteAddress = ({ city, state }) => ({
  type: "PROFILE_SAVE_VOTE_ADDRESS",
  payload: { city, state },
});

export const sendPhoneValidation = ({ phone, shouldNavigate = false })  => ({
  type: "PROFILE_SEND_PHONE_VALIDATION",
  payload: { phone, shouldNavigate },
});

export const sendingPhoneValidationError = error => ({
  type: "PROFILE_SENDING_PHONE_VALIDATION_ERROR",
  payload: { error },
});

export const savePhone = ({ phone, code }) => ({
  type: "PROFILE_SAVE_PHONE",
  payload: { phone, code },
});

export const phoneJustValidated = validated => ({
  type: "PROFILE_PHONE_JUST_VALIDATED",
  payload: { validated },
})

export const invalidatePhone = () => ({
  type: "PROFILE_INVALIDATE_PHONE",
});

export const profileUpdate = ({ birthdate, name, zipCode, voteIdCard, shouldNavigate = true }) => ({
  type: "PROFILE_UPDATE",
  payload: { birthdate, name, zipCode, voteIdCard, shouldNavigate },
});

export const clearProfileSaveErrors = () => ({
  type: "PROFILE_CLEAR_SAVE_ERRORS",
});

export const voteCardIdAcquired = voteCardId => ({
  type: "PROFILE_VOTE_CARD_ID_ACQUIRED",
  payload: { voteCardId },
});

export const tseVoteAddressAcquired = ({ tseVoteAddress } = {}) => ({
  type: "PROFILE_TSE_VOTE_ADDRESS_ACQUIRED",
  payload: { tseVoteAddress },
});

export const profileClearVoteAddressData = () => ({
  type: "PROFILE_CLEAR_VOTE_ADDRESS_DATA",
});

export const profileSaveAvatar = ({ avatar, oldAvatarURL = null, shouldNavigate = true }) => ({
  type: "PROFILE_SAVE_AVATAR",
  payload: { avatar, oldAvatarURL, shouldNavigate },
});

export const savingAvatar = isSaving => ({
  type: "PROFILE_SAVING_AVATAR",
  payload: { isSaving },
});

export const saveAvatarError = error => ({
  type: "PROFILE_SAVE_AVATAR_ERROR",
  payload: { error },
});

export const validateProfile = () => ({
  type: "PROFILE_VALIDATE_PROFILE",
});

export const profileValidationCompleted = ({ error }) => ({
  type: "PROFILE_VALIDATE_COMPLETED",
  payload: { error },
});

export const updateUser = ({ profile, validations }) => ({
  type: "UPDATE_USER",
  payload: { profile, validations },
})
