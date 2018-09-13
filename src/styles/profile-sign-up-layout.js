import { Platform, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

export default EStyleSheet.create({
  breadcrumb: {
    marginVertical: 15,
  },
  cantRememberVoteCardText: {
    color: "#FFF",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  cantRememberVoteCardContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginTop: 20,
    marginHorizontal: 20,
  },
  continueButtonTitle: {
    color: "#FFF",
    fontSize: "0.8rem",
  },
  cpfExampleText: {
    marginTop: 5,
    fontSize: 10,
  },
  headerTitle: {
    alignSelf: "center",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginHorizontal: 30,
    marginTop: 12,
    textAlign: "center",

    ...Platform.select({
      ios: {
        fontFamily: "roboto-light",
      },
      android: {
        fontFamily: "roboto_light",
      },
    }),
  },
  inputContainer: {
    marginTop: 14,
    marginHorizontal: 33,
  },
  lightText: {
    alignSelf: "center",
    color: "rgba(255, 255, 255, 0.71)",
    fontFamily: "roboto",
    fontSize: 16,
    textAlign: "center",
  },
  login: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  separatorLine: {
    borderBottomColor: "rgba(255,255,255,0.23)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 3,
  },
  separatorText: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    marginHorizontal: 8,
    opacity: 0.7,
    textAlign: "center",
  },
  signInContainer: {
    marginVertical: 10,
  },
  termsAcceptedCheckbox: {
    paddingLeft: 0,
  },
  termsAcceptedContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
  },
  termsAcceptedText: {
    fontSize: 12,
  },
  text: {
    color: "#FFF",
  },
  warningContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 33,
    marginTop: 20,
  },
  whyDocumentsText: {
    marginHorizontal: 10,
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#FFF",
  },
});
