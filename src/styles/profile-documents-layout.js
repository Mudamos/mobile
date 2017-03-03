import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  cantRememberVoteCard: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cantRememberVoteCardContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginTop: 12 },
  ]),
  inputContainer: {
    marginHorizontal: 33,
  },
  terms: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 13,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  termsOfUse: {
    fontWeight: "bold",
    marginTop: 1,
    marginLeft: 2,
  },
  whyDocumentsContainer: {
    margin: 20,
  },
  whyDocumentsText: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
