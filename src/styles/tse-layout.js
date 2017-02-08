import { StyleSheet } from "react-native";

import textStyles from "./text";


export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  controlsContainer: {
    backgroundColor: "black",
    flexDirection: "row",
    height: 42,
  },
  full: {
    flex: 1,
  },
  hPadded: {
    paddingHorizontal: 10,
  },
  page: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  pager: {
    flex: 1,
    paddingBottom: 20,
  },
  mediumVMargin: {
    marginVertical: 20,
  },
  navigationBar: {
    height: 70,
  },
  reference: {
    fontStyle: "italic",
  },
  smallVMargin: {
    marginVertical: 10,
  },
  tutorialText: StyleSheet.flatten([
    textStyles.subtitle,
    { marginBottom: 10 },
  ]),
});
