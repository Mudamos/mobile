import { allPass } from "ramda";
import { User } from "../models";

export const isFetchingProfile = state => state.profile.isFetching;

export const isSavingProfile = state => state.profile.isSaving;

export const isSendingPhoneValidation = state => state.profile.isSendingPhoneValidation;

export const currentUser = state => state.profile.currentUser;

export const profileSaveErrors = state => state.profile.errors;

export const hasProfileSaveErrors = state => state.profile.hasError;

export const profileSendPhoneValidationErrors = state => state.profile.sendValidationErrors;

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

export const isPhoneProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.mobile.status;
}

export const isAvatarProfileComplete = state => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.hasSavedAvatar;
}

export const isSavingAvatar = state => state.profile.isSavingAvatar;

export const isWalletProfileComplete = state => !!state.wallet.hasWallet;

export const wasPhoneValidated = state => state.profile.phoneJustValidated;

export const getSearchedVoteCardId = state => state.profile.voteCardId;

export const getCurrentUserAvatar = state => {
  const user = currentUser(state) || new User();
  return user.avatar;
}

export const isProfileComplete =
  allPass([
    isMainProfileComplete,
    isAvatarProfileComplete,
    isBirthProfileComplete,
    isAddressProfileComplete,
    isDocumentsProfileComplete,
    isWalletProfileComplete,
    isPhoneProfileComplete,
  ]);
