import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "#7705B9",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  avatarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  inputContainer: {
    marginHorizontal: 33,
  },
  submitButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    paddingHorizontal: 40,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  submitButtonTitle: {
    color: "#FFF",
  },
});
