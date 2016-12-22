import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  cantRememberVoteCard: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
  scrollView: {
    flex: 1,
  },
});
