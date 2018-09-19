import { Dimensions, StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import textStyles from "./text";

const { width } = Dimensions.get("window");

export default EStyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    flex: 1,
  },
  breadcrumb: {
    marginVertical: 15,
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
  },
  contentContainer: {
    marginTop: 12,
  },
  dontRememberZipCode: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  dontRememberZipCodeContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 14,
    marginTop: -14,
  },
  headerContainer: {
    marginHorizontal: 20,
  },
  headerSubTitle: {
    color: "#FFF",
    fontSize: "0.8rem",
    marginHorizontal: 10,
    textAlign: "justify",
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  map: {
    flex: 1,
    height: 500,
    width,
  },
  mapContainer: {
    marginVertical: 20,
    height: width,
  },
  zipCodeContainer: {
    marginHorizontal: 20,
  },
});
