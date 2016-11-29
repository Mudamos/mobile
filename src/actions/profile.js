export const profileSaveMain = ({ name, email, password }) => ({
  type: "PROFILE_SAVE_MAIN",
  payload: { name, email, password },
});

export const savingProfile = isSaving => ({
  type: "PROFILE_SAVING",
  payload: { isSaving },
});

export const updatedUserProfile = ({ user , profileComplete })=> ({
  type: "PROFILE_USER_UPDATED",
  payload: { currentUser: user, isProfileComplete: profileComplete },
});

export const saveUserProfileError = error => ({
  type: "PROFILE_USER_SAVE_FAILURE",
  payload: { error },
});
