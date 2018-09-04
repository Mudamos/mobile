import { StyleSheet } from "react-native";

export default StyleSheet.create({
  bubble: {
    borderColor: "#fff",
    borderWidth: 1,
    overflow: "hidden",
  },
  imageBubble: {
    overflow: "visible",
    top: -1,
  },
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingText: {
    position: "absolute",
    color: "black",
    fontWeight: "bold",
    textShadowColor: "white",
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 2,
  },
});
