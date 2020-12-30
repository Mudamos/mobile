import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",

    ...Platform.select({
      android: {
        height: 88,
        paddingTop: 20,
      },
      ios: {
        height: 68,
      },
    }),
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
    paddingLeft: 10,
  },
  middle: {
    flex: 3,
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
    paddingRight: 10,
  },
  title: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 24,
    textAlign: "center",
  },
});
