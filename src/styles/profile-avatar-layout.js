import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  avatarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  full: {
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
});
