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
  cantRememberVoteCardContainer: {
    marginVertical: 20,
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
});
