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
  phoneText: StyleSheet.flatten([
    textStyles.subtitle,
    { fontWeight: "bold" },
  ]),
  link: StyleSheet.flatten([
    textStyles.link,
  ]),
  navigationBar: {
    height: 70,
  },
  phoneInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resendLink: StyleSheet.flatten([
    textStyles.link,
    { marginTop: 24 },
  ]),
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
  wrongNumberContainer: {
    marginLeft: 5,
    justifyContent: "center",
  },
});
