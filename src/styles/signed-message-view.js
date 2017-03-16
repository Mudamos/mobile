import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 58,
    justifyContent: "space-between",
    padding: 12,
  },
  outerContainer: {
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  projectSigned: {
    backgroundColor: "transparent",
    color: "#fff",
    fontFamily: "lato",
    fontSize: 21,
    fontWeight: "bold",
  },
  userSignDate: {
    backgroundColor: "transparent",
    color: "#fff",
    fontFamily: "lato",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    width: 100,
  },
})
