import { takeLatest } from "redux-saga";
import { call, put, spawn, select } from "redux-saga/effects";

import {
  savingProfile,
  updatedUserProfile,
  profileStateMachine,
  saveUserProfileError,
  logginSucceeded,
} from "../actions";

import { currentAuthToken } from "../selectors";

import {
  User
} from "../models";

import { isDev } from "../utils";


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

      yield put(updatedUserProfile({ user, profileComplete: response.complete }));

      // Maybe the user was creating for the first time the account
      // or they were already logged in. Nevertheless log them again.
      const newAuth = { token: response.accessToken };
      yield call(sessionStore.persist, newAuth);
      yield put(logginSucceeded(newAuth));

      yield put(savingProfile(false));
      yield put(profileStateMachine());
    } catch(e) {
      if(isDev) console.log("saveMainProfile Error: ", e.message, e.stack, e);

      yield put(savingProfile(false));
      yield put(saveUserProfileError(e));
    }
  });
}


export default function* profileSaga({ mobileApi, sessionStore }) {
  yield spawn(saveMainProfile, { mobileApi, sessionStore });
}
