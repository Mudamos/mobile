import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    height: 64,
    backgroundColor: "#f86048"
  },
  middle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16
  }
});
