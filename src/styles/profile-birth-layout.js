import { StyleSheet } from "react-native";

import textStyles from "./text";

export default StyleSheet.create({
  container: {
    backgroundColor: "green",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([textStyles.header]),
  scrollView: {
    marginHorizontal: 20,
  },
});
