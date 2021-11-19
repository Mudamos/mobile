import { Platform } from "react-native";
import { equals } from "ramda";
import {
  getTrackingStatus,
  requestTrackingPermission,
} from "react-native-tracking-transparency";

import { logError } from "../utils";

export const TRACKING_STATUSES = {
  UNAVAILABLE: "unavailable",
  DENIED: "denied",
  AUTHORIZED: "authorized",
  RESTRICTED: "restricted",
  NOT_DETERMINED: "not-determined",
};

const ENABLED_STATUSES = [
  TRACKING_STATUSES.UNAVAILABLE,
  TRACKING_STATUSES.AUTHORIZED,
];

const status = getTrackingStatus;

const isEnabled = () =>
  status()
    .then((status) => ENABLED_STATUSES.includes(status))
    .catch((error) => {
      logError(error);

      return Platform.OS !== "ios";
    });

const canRequest = () =>
  status()
    .then(equals(TRACKING_STATUSES.NOT_DETERMINED))
    .catch((error) => {
      logError(error);

      return false;
    });

const requestPermission = () =>
  requestTrackingPermission()
    .then(equals(TRACKING_STATUSES.AUTHORIZED))
    .catch((error) => {
      logError(error);

      return Platform.OS !== "ios";
    });

export default () => ({
  canRequest,
  isEnabled,
  status,
  requestPermission,
});
