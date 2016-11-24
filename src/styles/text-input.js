import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    alignSelf: "stretch",
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 3,
    borderWidth: 1,
    height: 50,
    marginBottom: 10,
  },
  containerDisabled: {
    backgroundColor: "#eeeeee",
  },
  containerError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorIcon: {
    color: "red",
    fontSize: 20,
  },
  errorIconWrapper: {
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 10,
    position: "absolute",
    right: 0,
    top: 0,
  },
  hint: {
    color: "#bbbbbb",
    fontSize: 11,
    textAlign: "right",
  },
  hintWrapper: {
    paddingBottom: 6,
    paddingRight: 15,
    marginTop: -10,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  inputDisabled: {
    color: "#aaaaaa",
  },
  inputError: {
    paddingLeft: 14,
    paddingRight: 50,
    paddingBottom: 5,
  },
  label: {
    color: "#aaaaaa",
    fontSize: 11,
    fontWeight: "500",
  },
  labelWrapper: {
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: -7,
  },
});
