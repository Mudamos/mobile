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
  },
});
