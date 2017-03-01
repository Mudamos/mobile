import { takeLatest } from "redux-saga";
import { call, put, spawn, select } from "redux-saga/effects";

import { monitorUpload } from "./upload";

import {
  fetchingProfileError,
  isFetchingProfile,
  savingProfile,
  updatedUserProfile,
  navigate,
  phoneJustValidated,
  profileStateMachine,
  saveUserProfileError,
  savingAvatar,
  saveAvatarError,
  sendingPhoneValidation,
  sendingPhoneValidationError,
  logginSucceeded,
  unauthorized,
  voteCardIdAcquired,
} from "../actions";

import { currentAuthToken, currentUser } from "../selectors";

import {
  User,
} from "../models";

import { isDev, isUnauthorized, log, logError } from "../utils";

import Toast from "react-native-simple-toast";

import locale from "../locales/pt-BR";


function* saveMainProfile({ mobileApi, sessionStore }) {
  yield takeLatest("PROFILE_SAVE_MAIN", function* ({ payload }) {
    try {
      const { name, email, password } = payload;
      const apiPayload = { name };

      if (email) apiPayload.email = email;
      if (password) apiPayload.password = password;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
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
      const response = yield call(mobileApi.saveZipCode, authToken, location.toJson());

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine());
    } catch (e) {
      logError(e, { tag: "saveZipCodeProfile" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveDocumentsProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_DOCUMENTS", function* ({ payload }) {
    try {
      const { cpf, voteCard } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.saveDocuments, authToken, { cpf, voteCard });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield put(profileStateMachine());
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

      const authToken = yield select(currentAuthToken);
      const requestPayload = {
        mobile: {
          pinCode: code,
          number: phone,

          ...DeviceInfo.info().toJson(),
        },
      };

      const response = yield call(mobileApi.savePhone, authToken, requestPayload);

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));

      yield put(phoneJustValidated(true));
    } catch (e) {
      logError(e, { tag: "verifyCode" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    }
  });
}

function* saveAvatarProfile({ mobileApi }) {
  yield takeLatest("PROFILE_SAVE_AVATAR", function* ({ payload }) {
    const { avatar = {}, shouldNavigate } = payload;

    try {
      yield put(savingAvatar(true));

      const authToken = yield select(currentAuthToken);
      const avatarPayload = {
        ...avatar,
      };

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

      if (shouldNavigate)
        yield put(profileStateMachine());
      else {
        yield call([Toast, Toast.show], locale.avatarSaved);
      }
    } catch (e) {
      logError(e, { tag: "saveAvatarProfile" });

      yield put(savingAvatar(false));

      if (shouldNavigate && isUnauthorized(e)) return yield put(unauthorized({ type: "reset" }));

      yield put(saveAvatarError(e));
    }
  });
}

function* updateProfile({ mobileApi }) {
  yield takeLatest("PROFILE_UPDATE", function* ({ payload }) {
    try {
      const { birthdate, name, zipCode } = payload;

      yield put(savingProfile(true));

      const authToken = yield select(currentAuthToken);
      const response = yield call(mobileApi.updateProfile, authToken, { birthdate, name, zipCode });

      const user = User.fromJson(response.user);

      yield put(updatedUserProfile({ user }));
      yield put(savingProfile(false));
      yield call([Toast, Toast.show], locale.profileUpdated);
    } catch (e) {
      logError(e, { tag: "updateProfile" });

      yield put(savingProfile(false));

      if (isUnauthorized(e)) return yield put(unauthorized({ type: "reset"}));

      yield put(saveUserProfileError(e));
    }
  });
}


export function* fetchProfile({ mobileApi }) {
  try {
    let user = yield select(currentUser);

    if (user) return user;

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
      yield put(fetchingProfileError(true));
    }
  });
}

export default function* profileSaga({ mobileApi, DeviceInfo, sessionStore }) {
  yield spawn(saveMainProfile, { mobileApi, sessionStore });
  yield spawn(updateProfile, { mobileApi });
  yield spawn(saveAvatarProfile, { mobileApi });
  yield spawn(saveBirthdateProfile, { mobileApi });
  yield spawn(saveZipCodeProfile, { mobileApi });
  yield spawn(saveDocumentsProfile, { mobileApi });
  yield spawn(sendPhoneValidation, { mobileApi });
  yield spawn(savePhoneProfile, { mobileApi, DeviceInfo });
  yield spawn(fetchProfileSaga, { mobileApi });
}
