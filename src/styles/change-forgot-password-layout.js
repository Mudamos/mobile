import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  actionText: {
    textAlign: "center",
    fontFamily: "roboto",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  full: {
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  highMargin: {
    marginTop: 30,
  },
  inputContainer: {
    marginHorizontal: 33,
  },
  resendCode: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});
