import { allPass } from "ramda";
import { User } from "../models";
import { validateCpf } from "../utils";

export const isFetchingProfile = (state) => state.profile.isFetching;

export const isSavingProfile = (state) => state.profile.isSaving;

export const isSigningUp = (state) => state.profile.isSigningUp;

export const isSendingPhoneValidation = (state) =>
  state.profile.isSendingPhoneValidation;

export const currentUser = (state) => state.profile.currentUser;

export const profileSaveErrors = (state) => state.profile.errors;

export const hasProfileSaveErrors = (state) => state.profile.hasError;

export const profileSendPhoneValidationErrors = (state) =>
  state.profile.sendValidationErrors;

export const isFacebookMainProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();

  if (currentUser.profileType === "facebook") {
    return currentUser.cpf && currentUser.email && currentUser.termsAccepted;
  } else {
    return true;
  }
};

export const isMainProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.email && currentUser.cpf && validateCpf(currentUser.cpf);
};

export const isDetailProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.name && currentUser.birthdate && currentUser.voteCard;
};

export const isBirthProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return !!currentUser.birthdate;
};

export const isAddressProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return !!currentUser.zipCode;
};

export const isVoteAddressProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.hasVoteAddress;
};

export const isDocumentsProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.cpf && currentUser.voteCard;
};

export const isPhoneProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.mobile.status;
};

export const isAvatarProfileComplete = (state) => {
  const currentUser = state.profile.currentUser || new User();
  return currentUser.hasSavedAvatar;
};

export const isSavingAvatar = (state) => state.profile.isSavingAvatar;

export const isWalletProfileComplete = (state) => !!state.wallet.hasWallet;

export const wasPhoneValidated = (state) => state.profile.phoneJustValidated;

export const getSearchedVoteCardId = (state) => state.profile.voteCardId;

export const getTseVoteAddress = (state) => state.profile.tseVoteAddress;

export const getCurrentUserAvatar = (state) => {
  const user = currentUser(state) || new User();
  return user.avatar;
};

export const avatarSaveErrors = (state) => state.profile.avatarError;

export const currentUserCity = (state) => {
  const user = currentUser(state) || new User();
  return user.address.city;
};

export const currentUserUf = (state) => {
  const user = currentUser(state) || new User();
  return user.address.uf;
};

export const isProfileComplete = allPass([
  isMainProfileComplete,
  isAvatarProfileComplete,
  isBirthProfileComplete,
  isAddressProfileComplete,
  isDocumentsProfileComplete,
  isWalletProfileComplete,
  isPhoneProfileComplete,
]);

export const isSigningUpComplete = (state) => {
  return isProfileComplete && !isSigningUp(state);
};

export const isValidatingProfile = (state) => state.profile.validatingProfile;
