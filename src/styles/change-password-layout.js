import { StyleSheet } from "react-native";

import textStyles from "./text";


export default StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  inputContainer: {
    marginHorizontal: 33,
  },
});
