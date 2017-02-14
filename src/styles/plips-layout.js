import { StyleSheet } from "react-native";

export default StyleSheet.create({
  full: {
    flex: 1,
  },
  navigationBar: {
    backgroundColor: "#883DE1",
    height: 84,
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  separator: {
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    height: 66,
    padding: 12,
  },
  userName: {
    color: "#883DE1",
    fontFamily: "roboto",
    fontSize: 18,
  },
});
