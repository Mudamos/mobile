import EStyleSheet from "react-native-extended-stylesheet";
import { StyleSheet } from "react-native";

export default EStyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  buttonStyle: {
    backgroundColor: "#00BFD8",
    marginVertical: 20,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  separatorLine: {
    borderBottomColor: "#FFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  small: {
    fontSize: "0.8rem",
  },
  text: {
    color: "#FFF",
    fontSize: "1rem",
    marginTop: 10,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
  },
});