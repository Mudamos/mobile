import { all, call, fork, put, spawn, select, takeLatest } from "redux-saga/effects";
import { Alert } from "react-native";

import { monitorUpload } from "./upload";

import {
  fetchingProfileError,
  isFetchingProfile,
  savingProfile,
  updatedUserProfile,
  navigate,
  phoneJustValidated,
  profileClearVoteAddressData,
  profileStateMachine,
  saveUserProfileError,
  savingAvatar,
  saveAvatarError,
  sendingPhoneValidation,
  sendingPhoneValidationError,
  logginSucceeded,
  unauthorized,
  voteCardIdAcquired,
  logEvent,
  invalidatePhone,
  profileValidationCompleted,
} from "../actions";

import {
  avatarSaveErrors,
  currentAuthToken,
  currentUser,
  getChangePasswordErrors,
  getCurrentSigningPlip,
  isProfileComplete,
  profileSaveErrors,
} from "../selectors";

import {
  User,
} from "../models";

import { isDev, isUnauthorized, log, logError, isBlank } from "../utils";

import Toast from "react-native-simple-toast";

import locale from "../locales/pt-BR";
import { blockBuilder } from "./crypto";
import { validateLocalWallet } from "./wallet";
import { changePasswordSaga } from "./password";

function* saveMainProfile({ mobileApi, sessionStore, Crypto }) {
  yield takeLatest("PROFILE_SAVE_MAIN", function* ({ payload }) {
    try {
      const { cpf, email, password, termsAccepted } = payload;
      const apiPayload = { user: { cpf } };

      if (email) apiPayload.user.email = email;
      if (password) apiPayload.user.password = password;
      if (termsAccepted) apiPayload.user.termsAccepted = termsAccepted ? 1 : 0;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);

      if (!authToken) {
        const currentSigningPlip = yield select(getCurrentSigningPlip);
        if (currentSigningPlip) apiPayload.plipId = currentSigningPlip.id;

        const message = [apiPayload.user.cpf, apiPayload.user.email, apiPayload.user.password, apiPayload.user.termsAccepted].join(";");
        apiPayload.block = yield call(blockBuilder, { message, mobileApi, Crypto });
      }

      const response = yield call(mobileApi.signUp, authToken, apiPayload);

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));

      // Maybe the user was creating for the first time the account
      // or they were already logged in. Nevertheless log them again.
      const newAuth = { token: response.accessToken };
      yield call(sessionStore.persist, newAuth);
      yield put(logginSucceeded(newAuth));

      yield put(savingProfile(false));
      yield put(profileStateMachine());
      yield put(logEvent({ name: "app_signup" }));
    } catch(e) {
      logError(e, { tag: "saveMainProfile" });

      yield put(savingProfile(false));
      yield put(saveUserProfileError(e));
    }
  });
}

function* saveBirthdateProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_BIRTH_DATE", function* ({ payload }) {
    try {
      const { birthdate } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.saveBirthdate, authToken, birthdate);

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine());
      yield put(logEvent({ name: "completed_birthday" }));
    } catch (e) {
      logError(e, { tag: "saveBirthdateProfile" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveZipCodeProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_ZIP_CODE", function* ({ payload }) {
    try {
      const { location } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.saveZipCode, authToken, {
        ...location.toJson(),
        lat: location.latitude ? location.latitude : "",
        lng: location.longitude ? location.longitude : "",
      });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine())
      yield put(logEvent({ name: "completed_zip_code" }));
    } catch (e) {
      logError(e, { tag: "saveZipCodeProfile" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveVoteAddress({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_VOTE_ADDRESS", function* ({ payload }) {
    try {
      const { city, state } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.saveVoteAddress, authToken, {
        city,
        state,
      });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine())
      yield put(logEvent({ name: "completed_vote_address" }));
      yield put(profileClearVoteAddressData());
    } catch (e) {
      logError(e, { tag: "saveVoteAddress" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveDocumentsProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_DOCUMENTS", function* ({ payload }) {
    try {
      const { cpf, voteCard, termsAccepted } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.saveDocuments, authToken, { cpf, voteCard, termsAccepted });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine());
      yield put(logEvent({ name: "completed_documents" }));
    } catch (e) {
      logError(e, { tag: "saveDocumentsProfile" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    } finally {
      // Cleanup data
      yield put(voteCardIdAcquired(null));
    }
  });
}

function* sendPhoneValidation({ mobileApi }) {
  yield takeLatest("PROFILE_SEND_PHONE_VALIDATION", function* ({ payload }) {
    try {
      const { phone, shouldNavigate } = payload;

      yield put(savingProfile(false));

      yield put(sendingPhoneValidation(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.sendPhoneValidation, authToken, phone);

      if (isDev) {
        console.log("[PIN CODE]", response);
        Toast.show(`CODE: ${response}`);
      }

      yield put(sendingPhoneValidation(false));

      if (shouldNavigate) {
        yield put(navigate("profilePhoneCode", { phone }));
      } else {
        yield call([Toast, Toast.show], locale.phoneValidationCodeSent);
      }

      yield put(logEvent({ name: "phone_validation_sent" }));
    } catch (e) {
      logError(e, { tag: "sendPhoneValidation" });

      yield put(sendingPhoneValidation(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(sendingPhoneValidationError(e));
    }
  });
}

function* savePhoneProfile({ mobileApi, DeviceInfo }) {
  yield takeLatest("PROFILE_SAVE_PHONE", function* ({ payload }) {
    try {
      const { code, phone } = payload;

      yield put(savingProfile(true));

      const deviceInfo = yield call(DeviceInfo.info);

      const authToken = yield select(currentAuthToken);
      const requestPayload = {
        mobile: {
          pinCode: code,
          number: phone,

          ...deviceInfo.toJson(),
        },
      };

      const response = yield call(mobileApi.savePhone, authToken, requestPayload);

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));

      yield put(phoneJustValidated(true));
      yield put(logEvent({ name: "completed_phone_validation" }));
    } catch (e) {
      logError(e, { tag: "verifyCode" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveAvatarProfileSaga({ mobileApi, avatar = {}, oldAvatarURL, shouldNavigate }) {
  try {
    yield put(savingAvatar(true));

    const authToken = yield select(currentAuthToken);
    const avatarPayload = avatar && avatar.uri && avatar.uri !== oldAvatarURL ?
      { ...avatar } :
      { oldAvatarURL };

    log(`avatar payload: ${JSON.stringify(avatarPayload)}`);

    yield call(monitorUpload, mobileApi.saveAvatar(authToken, avatarPayload), function ({ type, payload: uploadPayload }) {
      switch (type) {
        case "UPLOAD_PROGRESS":
          log(`upload progress ${uploadPayload}`);
          break;
        case "UPLOAD_FINISHED":
          log("upload finished", uploadPayload)
          break;
        case "UPLOAD_FAILED":
          throw uploadPayload;
      }
    });

    const response = yield call(mobileApi.profile, authToken);
    const user = User.fromJson(response.user);

    yield put(updatedUserProfile({ user }));
    yield put(savingAvatar(false));

    if (shouldNavigate) {
      yield put(profileStateMachine());
    }

    yield put(logEvent({ name: "completed_avatar" }));
  } catch (e) {
    logError(e, { tag: "saveAvatarProfile" });

    yield put(savingAvatar(false));

    if (shouldNavigate && isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

    yield put(saveAvatarError(e));
  }
}

function* saveAvatarProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_AVATAR", function* ({ payload }) {
    const { avatar = {}, oldAvatarURL, shouldNavigate } = payload;

    yield call(saveAvatarProfileSaga, { mobileApi, avatar, oldAvatarURL, shouldNavigate });
  });
}

function* updateProfileSaga({ mobileApi, birthdate, name, zipCode, voteIdCard, shouldNavigate }) {
  try {
    yield put(savingProfile(true));

    const authToken = yield select(currentAuthToken);
    const response = yield call(mobileApi.updateProfile, authToken, { birthdate, name, zipCode, voteIdCard });

    const user = User.fromJson(response.user);

    yield put(updatedUserProfile({ user }));
    yield put(savingProfile(false));
    if (shouldNavigate) {
      yield put(profileStateMachine());
    }
  } catch (e) {
    logError(e, { tag: "updateProfile" });

    yield put(savingProfile(false));

    if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

    yield put(saveUserProfileError(e));
  }
}

function* updateProfile({ mobileApi }) {
  yield takeLatest("PROFILE_UPDATE", function* ({ payload }) {
    const { birthdate, name, zipCode, voteIdCard, shouldNavigate } = payload;

    yield call(updateProfileSaga, { mobileApi, birthdate, name, zipCode, voteIdCard, shouldNavigate })
  });
}


export function* fetchProfile({ mobileApi, force = false }) {
  try {
    let user = yield select(currentUser);

    if (!force && user) return user;

    yield put(isFetchingProfile(true));

    const authToken = yield select(currentAuthToken);
    if (!authToken) return;

    const response = yield call(mobileApi.profile, authToken);
    user = User.fromJson(response.user);

    yield put(updatedUserProfile({ user }));

    return user;
  } finally {
    yield put(isFetchingProfile(false));
  }
}

export function* fetchProfileSaga({ mobileApi }) {
  yield takeLatest("PROFILE_FETCH", function* () {
    try {
      yield put(fetchingProfileError(false));
      yield call(fetchProfile, { mobileApi });
    } catch (e) {
      if (isUnauthorized(e)) return yield put(unauthorized());
      logError(e);
      yield put(fetchingProfileError(true));
    }
  });
}

function* validateProfile({ dispatch, mobileApi, walletStore }) {
  function* navigateToMissingScreen() {
    return yield put(profileStateMachine({ type: "reset" }));
  }

  yield takeLatest("PROFILE_VALIDATE_PROFILE", function* () {
    try {
      const user = yield call(fetchProfile, { mobileApi, force: true });

      if (!user.voteCard) {
        log("User does not have a vote card");
        yield put(profileValidationCompleted({ error: false }));
        return yield call(navigateToMissingScreen);
      }

      const publicKey = yield call(walletStore.publicKey, user.voteCard);
      log(`User public key: ${publicKey}`);

      if (!publicKey || (publicKey !== user.wallet.key || !user.wallet.status)) {
        log("Public key does not match");
        Alert.alert(
          locale.invalidSignature,
          locale.willCreateNewWallet,
          [{text: locale.ok, onPress: () => dispatch(profileStateMachine())}]
        );

        yield put(invalidatePhone());
        return yield put(profileValidationCompleted({ error: false }));
      }

      if (!(yield call(validateLocalWallet, { walletStore }))) {
        log("Wallet is invalid");
        yield put(profileValidationCompleted({ error: false }));
        return yield call(navigateToMissingScreen);
      }

      if (!(yield select(isProfileComplete))) {
        log("Profile is not complete");
        yield put(profileValidationCompleted({ error: false }));
        return yield call(navigateToMissingScreen);
      }

      yield call([Toast, Toast.show], locale.validProfile);
      yield put(profileValidationCompleted({ error: false }));
    } catch(e) {
      if (isUnauthorized(e)) return yield put(unauthorized());

      yield put(profileValidationCompleted({ error: true }));
    }
  });
}

function* updateUser({ mobileApi }) {
  yield takeLatest("UPDATE_USER", function* (action) {
    const { avatar, birthdate, name, zipCode, currentPassword, newPassword } = action.payload.profile;
    const { validAvatar, validProfileFields, validPassword } = action.payload.validations;
    const shouldNavigate = false;

    yield all([
      validAvatar ? call(saveAvatarProfileSaga, { mobileApi, avatar, shouldNavigate }) : Promise.resolve(),
      validProfileFields ? call(updateProfileSaga, { mobileApi, birthdate, name, zipCode, shouldNavigate }) : Promise.resolve(),
      validPassword ? call(changePasswordSaga, { mobileApi, currentPassword, newPassword }) : Promise.resolve(),
    ]);

    const avatarError = yield select(avatarSaveErrors);
    const profileErrors = yield select(profileSaveErrors);
    const passwordErrors = yield select(getChangePasswordErrors);

    if (isBlank(avatarError) && isBlank(profileErrors) && isBlank(passwordErrors)) {
      yield put(navigate("plipsNav", { type: "reset" }));
      yield call([Toast, Toast.show], locale.profileUpdated);
    }
  });
}

export default function* profileSaga({ dispatch, mobileApi, DeviceInfo, sessionStore, Crypto, walletStore }) {
  yield spawn(saveMainProfile, { mobileApi, sessionStore, Crypto });
  yield spawn(updateProfile, { mobileApi });
  yield spawn(saveAvatarProfile, { mobileApi });
  yield spawn(saveBirthdateProfile, { mobileApi });
  yield spawn(saveZipCodeProfile, { mobileApi });
  yield spawn(saveDocumentsProfile, { mobileApi });
  yield spawn(sendPhoneValidation, { mobileApi });
  yield spawn(savePhoneProfile, { mobileApi, DeviceInfo });
  yield fork(saveVoteAddress, { mobileApi });
  yield spawn(fetchProfileSaga, { mobileApi });
  yield fork(validateProfile, { dispatch, mobileApi, walletStore });
  yield fork(updateUser, { mobileApi });
}
