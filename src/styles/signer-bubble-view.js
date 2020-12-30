import { StyleSheet } from "react-native";

const BUBBLE_SIZE = 30;
const BUBBLE_MARGIN = 4;

const bubble = {
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
};

export default StyleSheet.create({
  bubble,
  bubbleWithBorder: {
    ...bubble,
    backgroundColor: "#D6C0E9",
    borderColor: "transparent",
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
