import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  hiddenFieldContainer: {
    justifyContent: "center",
    flexDirection: "row",
    top: 0,
    position: "absolute",
  },
});
