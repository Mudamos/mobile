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
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  navigationBar: {
    height: 70,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  subHeader: StyleSheet.flatten([
    textStyles.subtitle,
    { marginBottom: 5 },
  ]),
});
