import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
  },
  bar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  middle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
