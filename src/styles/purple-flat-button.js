import { StyleSheet } from "react-native";

export default StyleSheet.create({
  gradientContainer: {
    borderRadius: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,

    ...StyleSheet.absoluteFillObject,
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "roboto",
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
