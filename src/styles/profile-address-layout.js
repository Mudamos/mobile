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
  layoutContentStyle: {
    flexDirection: "column-reverse",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  subHeader: StyleSheet.flatten([
    textStyles.subtitle,
    { marginBottom: 5 },
  ]),
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
});
