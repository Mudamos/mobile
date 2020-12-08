import { Alert, Platform } from "react-native";
import Permissions from "react-native-permissions";
import { includes } from "ramda";

import { log } from "../utils";
import locale from "../locales/pt-BR";

export const DENIED = "denied";
export const AUTHORIZED = "authorized";
export const OPEN_SETTINGS = "open_settings";

const successStatuses = [
  Permissions.RESULTS.GRANTED,
  Permissions.RESULTS.LIMITED,
];

const isAuthorized = (status) => includes(status, successStatuses);

const presentRationale = ({ message }) =>
  new Promise((resolve) => {
    const onCancel = () => resolve(DENIED);
    const onOk = () => resolve(OPEN_SETTINGS);

    // Sometimes during a screen transition, firing an alert would fail silently.
    // Seen only on Android
    // react-native bug?
    setTimeout(() => {
      Alert.alert(locale.whyDoWeeNeedPermission, message, [
        { text: locale.noThanks, onPress: onCancel, style: "cancel" },
        { text: locale.openSettings, onPress: onOk },
      ]);
    }, 500);
  });

const onPermissionRequest = (response, { permission, message, rationale }) => {
  log(response, { tag: ["requestPermission", permission] });

  if (isAuthorized(response)) return AUTHORIZED;
  if (!rationale) return DENIED;

  return presentRationale({ message });
};

const requestPermission = (permission, { message, rationale = true } = {}) =>
  Permissions.request(permission).then((response) =>
    onPermissionRequest(response, { permission, message, rationale }),
  );

const checkStatus = (permission) =>
  Permissions.check(permission).then((result) =>
    isAuthorized(result) ? AUTHORIZED : DENIED,
  );

const service = () => ({
  checkStatus,
  presentRationale,
  requestPermission,
  permissions: {
    camera: Platform.select({
      android: Permissions.PERMISSIONS.ANDROID.CAMERA,
      ios: Permissions.PERMISSIONS.IOS.CAMERA,
    }),
    location: Platform.select({
      android: Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: Permissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
    photo: Platform.select({
      android: Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: Permissions.PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
  },
});

export default service;
