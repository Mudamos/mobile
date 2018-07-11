import { Dimensions, StyleSheet } from "react-native";

import textStyles from "./text";

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
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
    fontSize: 10,
    fontWeight: "500"
  },
  dontRememberZipCodeContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginHorizontal: 14,
    marginTop: -14,
  },
  headerContainer: {
    marginHorizontal: 20
  },
  headerSubTitle: {
    color: "#FFF",
    fontSize: 12,
    marginHorizontal: 10,
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
  }
});
