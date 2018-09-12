import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  full: {
    flex: 1,
  },
  hasCode: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  inputContainer: {
    marginHorizontal: 33,
  },
});
