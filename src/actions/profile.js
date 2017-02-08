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

export const phoneValidationSent = hasSent => ({
  type: "PROFILE_PHONE_VALIDATION_SENT",
  payload: { hasSent },
});

export const profileSaveMain = ({ name, email, password }) => ({
  type: "PROFILE_SAVE_MAIN",
  payload: { name, email, password },
});

export const saveProfileBirthdate = birthdate => ({
  type: "PROFILE_SAVE_BIRTH_DATE",
  payload: { birthdate },
});

export const saveProfileDocuments = ({ cpf, voteCard }) => ({
  type: "PROFILE_SAVE_DOCUMENTS",
  payload: { cpf, voteCard },
});

export const savingProfile = isSaving => ({
  type: "PROFILE_SAVING",
  payload: { isSaving },
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

export const sendPhoneValidation = phone => ({
  type: "PROFILE_SEND_PHONE_VALIDATION",
  payload: { phone },
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

export const profileUpdate = ({ birthdate, name, zipCode }) => ({
  type: "PROFILE_UPDATE",
  payload: { birthdate, name, zipCode },
});

export const clearProfileSaveErrors = () => ({
  type: "PROFILE_CLEAR_SAVE_ERRORS",
});

export const voteCardIdAcquired = voteCardId => ({
  type: "PROFILE_VOTE_CARD_ID_ACQUIRED",
  payload: { voteCardId },
});
