import { StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import textStyles from "./text";

export default EStyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  avatar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  avatarText: {
    color: "black",
    fontWeight: "bold",
    textShadowColor: "white",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 2,
  },
  inputContainer: {
    marginHorizontal: 33,
  },
  resultText: {
    color: "#000",
    fontFamily: "roboto",
    fontSize: "0.775rem",
    flex: 1,
  },
  selectContainer: {
    zIndex: 1,
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
