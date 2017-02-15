import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  dontRememberZipCode: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  dontRememberZipCodeContainer: {
    marginVertical: 20,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8 },
  ]),
});
