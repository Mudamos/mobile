import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  continueButton: {
    backgroundColor: "rgba(230, 230, 230, 0.3)",
    borderWidth: 0,
    marginHorizontal: 20,
  },
  continueButtonContainer: {
    marginTop: 18,
  },
  continueButtonTitle: {
    color: "#FFF",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 10,
    textAlign: "center",
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { fontSize: 18 },
  ]),
  inputContainer: {
    marginHorizontal: 33,
  },
  logo: {
    alignSelf: "center",
    top: -20,
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 18,
  },
  separatorLine: {
    borderBottomColor: "rgba(255,255,255,1)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 3,
  },
  separatorText: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 18,
    marginHorizontal: 10,
    textAlign: "center",
  },
  signUpContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  registerTitle: StyleSheet.flatten([
    textStyles.header,
    { fontSize: 16, fontWeight: "400" },
  ]),
  registerLink: StyleSheet.flatten([
    textStyles.link,
    { fontSize: 16, fontWeight: "500", paddingLeft: 5 },
  ]),
});
