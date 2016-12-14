import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
  },
  bar: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  middle: {
    flex: 1,
    flexGrow: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
