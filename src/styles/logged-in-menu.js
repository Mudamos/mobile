import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    textAlign: "center",
  },
  menuList: {
    marginTop: 60,
  },
  userName: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 16,
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "roboto",
    textAlign: "center",
  },
});
