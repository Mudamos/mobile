import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  blueRoundedButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginTop: 20,
    marginHorizontal: 20,
  },
  blueRoundedButtonTitle: {
    color: "#FFF",
    fontSize: 12,
  },
  breadcrumb: {
    marginVertical: 15,
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: 20,
  },
  headerSubTitle: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 20,
    marginHorizontal: 10,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  plipContainer: {
    marginVertical: 20,
  },
});
