import { useCallback } from "react";
import { Linking } from "react-native";

export const useOpenSettings = () =>
  useCallback(() => Linking.openSettings(), []);
