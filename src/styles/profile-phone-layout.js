import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  phoneText: StyleSheet.flatten([
    textStyles.subtitle,
    { fontWeight: "bold" },
  ]),
  resendLink: {
    textAlign: "center",
    lineHeight: 16,
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    marginTop: 24,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  subHeader: StyleSheet.flatten([
    textStyles.subtitle,
    { marginBottom: 5 },
  ]),
  typeCodeText: {
    marginTop: 30,
    textAlign: "center",
    fontFamily: "roboto",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 23,
    color: "#fff",
    alignSelf: "center",
  },
});
