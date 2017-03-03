import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatar: {
    borderColor: "transparent",
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
    paddingTop: 80,
  },
  contentContainer: {
    flex: 1,
  },
  darkSmallText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "roboto",
    fontSize: 11,
  },
  full: {
    flex: 1,
  },
  menuListContainer: {
    flex: 3,
    marginTop: 60,
  },
  profileInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  userNameContainer: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 16,
  },
  rowContainer: {
    height: 60,
  },
  row: {
    paddingHorizontal: 23,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  mediumText: {
    fontFamily: "roboto",
    fontSize: 13,
    lineHeight: 15,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 23,
    height: 70,
    borderTopColor: "rgba(0, 0, 0, 0.13)",
    borderTopWidth: 1,
  },
  loader: {
    flex: 1,
    alignItems: "center",
  },
  loaderText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "roboto",
    textAlign: "center",
  },
});
