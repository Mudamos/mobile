import { StyleSheet } from "react-native";

import textStyles from "./text";

const actionText = {
  textAlign: "center",
  fontFamily: "roboto",
  fontSize: 18,
  fontWeight: "bold",
  color: "#fff",
  alignSelf: "center",
};

export default StyleSheet.create({
  actionText: {
    ...actionText,
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  fieldGroup: {
    ...actionText,
    fontSize: 14,
    fontWeight: "normal",
    marginTop: 20,
  },
  fieldTitle: {
    ...actionText,
    fontSize: 14,
  },
  full: {
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
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
