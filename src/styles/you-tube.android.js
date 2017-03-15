import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  bigPlayButton: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    width: 70,
  },
  thumb: {
    flex: 1,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "white",
    fontSize: 20,
  },
});
