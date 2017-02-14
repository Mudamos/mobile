import { StyleSheet } from "react-native";

const AVATAR_SIZE = 50;

export default StyleSheet.create({
  avatar: {
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: 12,
  },
  full: {
    flex: 1,
  },
  navigationBar: {
    backgroundColor: "#883DE1",
    height: 64,
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  section: {
    color: "#797979",
    fontFamily: "roboto",
    fontSize: 10,
  },
  separator: {
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  signDate: {
    color: "#838383",
    fontFamily: "roboto",
    fontSize: 11,
  },
  tableRow: {
    flexDirection: "row",
    height: 66,
    padding: 12,
  },
  tableSection: {
    backgroundColor: "#f3f3f3",
    height: 25,
    justifyContent: "center",
    padding: 12,
  },
  userName: {
    color: "#883DE1",
    fontFamily: "roboto",
    fontSize: 18,
  },
});
