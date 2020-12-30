import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  full: {
    flex: 1,
  },
  phoneText: StyleSheet.flatten([textStyles.subtitle, { fontWeight: "bold" }]),
  link: StyleSheet.flatten([textStyles.link]),
  phoneInfoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resendLink: StyleSheet.flatten([textStyles.link, { marginTop: 24 }]),
  subHeader: StyleSheet.flatten([textStyles.subtitle, { marginBottom: 5 }]),
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
