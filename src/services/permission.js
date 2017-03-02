import { Alert } from "react-native";
import Permissions from "react-native-permissions";

import { log } from "../utils";
import locale from "../locales/pt-BR";


export const DENIED = "denied";
export const AUTHORIZED = "authorized";
export const OPEN_SETTINGS = "open_settings";

const isAuthorized = status => status === AUTHORIZED;

const presentRationale = (permission, { message }) => new Promise((resolve) => {
  const onCancel = () => resolve(DENIED);
  const onOk = () => resolve(OPEN_SETTINGS);

  // Sometimes during a screen transition, firing an alert would fail silently.
  // Seen only on Android
  // react-native bug?
  setTimeout(() => {
    Alert.alert(
      locale.whyDoWeeNeedPermission,
      message,
      [
        { text: locale.noThanks, onPress: onCancel, style: "cancel" },
        { text: locale.openSettings, onPress: onOk },
      ]
    )
  }, 500);
});

const onPermissionRequest = (response, { permission, message, rationale }) => {
  log(response, { tag: ["requestPermission", permission]});

  if (isAuthorized(response)) return AUTHORIZED;
  if (!rationale) return DENIED;

  return presentRationale(permission, { message });
};

const requestPermission = (permission, { message, rationale = true } = {}) =>
  Permissions
    .requestPermission(permission)
      .then(response => onPermissionRequest(response, { permission, message, rationale }))

const checkStatus = permission =>
  Permissions
    .getPermissionStatus(permission)

const service = () => ({
  checkStatus,
  presentRationale,
  requestPermission,
});

export default service;
