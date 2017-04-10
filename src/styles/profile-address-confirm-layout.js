import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 20,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  link: StyleSheet.flatten([
    textStyles.link,
  ]),
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    backgroundColor: "transparent",
    flex: 1.5,
  },
  mapShadow: {
    height: 30,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.5,
    zIndex: 10,
  },
  subHeader: StyleSheet.flatten([
    textStyles.subtitle,
    { marginBottom: 5 },
  ]),
  wrongZipCodeContainer: {
    marginLeft: 10,
    marginTop: 2,
    justifyContent: "center",
  },
  zipCode: {
    fontFamily: "roboto",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "#fff",
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 14,
  },
  zipCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
