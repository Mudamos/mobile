import { StyleSheet } from "react-native";

const BUBBLE_SIZE = 30;
const BUBBLE_MARGIN = 4;


export default StyleSheet.create({
  bubble: {
    height: BUBBLE_SIZE,
    width: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    borderColor: "rgba(0,0,0,.5)",
    borderWidth: 1,
    marginRight: BUBBLE_MARGIN,
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageBubble: {
    overflow: "visible",
    top: -1,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  exceeding: {
    color: "#000",
    fontFamily: "roboto",
    fontSize: 14,
    textAlign: "center",
  },
});
