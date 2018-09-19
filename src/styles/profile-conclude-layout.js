import { StyleSheet } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import textStyles from "./text";

export default EStyleSheet.create({
  blueRoundedButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginTop: 20,
  },
  blueRoundedButtonTitle: {
    color: "#FFF",
    fontSize: "0.7rem",
  },
  breadcrumb: {
    marginVertical: 15,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
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
    fontSize: "0.8rem",
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
