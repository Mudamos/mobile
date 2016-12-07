import { User } from "../models";


export const isSavingProfile = state => state.profile.isSaving;

export const currentUser = state => state.profile.currentUser;

export const profileSaveErrors = state => state.profile.errors;

export const isProfileComplete = state => state.profile.isProfileComplete;

export const isMainProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.name && currentUser.email;
};

export const isBirthProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return !!currentUser.birthdate;
}

export const isAddressProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return !!currentUser.zipCode;
}

export const isDocumentsProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.cpf && currentUser.voteCard;
}
