import { StyleSheet } from "react-native";

export default StyleSheet.create({
  avatar: {
    borderColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 60,
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
  menuHeaderContainer: {
    flex: 1,
  },
  menuListContainer: {
    flex: 4,
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
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
    flex: 1,
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
