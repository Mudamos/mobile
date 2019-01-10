import { Dimensions } from "react-native";

const { height: windowHeight } = Dimensions.get("window");

import EStyleSheet from "react-native-extended-stylesheet";

export default EStyleSheet.create({
  chevronButtonContainer: {
    position: "absolute",
    top: windowHeight / 2,
  },
  bold: {
    fontWeight: "bold",
  },
  button: {
    height: 40,
    borderColor: "#FFF",
  },
  buttonTitle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#6000AA",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 100,
  },
  full: {
    flex: 7,
  },
  page: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  pager: {
    flex: 1,
  },
  pagerContainer: {
    flex: 1,
  },
  selectedDot: {
    backgroundColor: "#00BFD8",
  },
  text: {
    color: "#FFF",
    marginVertical: 8,
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
});