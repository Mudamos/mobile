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
  scrollView: {
    flex: 1,
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  separatorLine: {
    borderTopColor: "rgba(255, 255, 255, .5)",
    borderTopWidth: 1,
    flex: 1,
    height: 1,
    marginTop: 2,
  },
  separatorText: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    marginHorizontal: 8,
    opacity: 0.7,
    textAlign: "center",
  },
});
