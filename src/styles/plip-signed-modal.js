import { StyleSheet } from "react-native";
import simpleModalStyles from "./simple-modal";
import textStyles from "./text";

export default StyleSheet.create({
  footer: StyleSheet.flatten([
    simpleModalStyles.footer,
  ]),
  modalLink: StyleSheet.flatten([
    textStyles.modalLinkContainerShort,
  ]),
});
