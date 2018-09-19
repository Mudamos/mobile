import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .6)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  loader: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 14,
    borderColor: "#FFF",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  progressLayer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderBottomColor: "#00BFD8",
    position: "absolute",
  },
  progressText: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
  },
});
