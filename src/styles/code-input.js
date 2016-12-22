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
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    flexDirection: "row",
  },
});
