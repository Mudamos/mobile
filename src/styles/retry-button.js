import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  disabled: {
    opacity: .5,
  },
  enabled: {
    opacity: 1,
  },
  icon: {
    marginRight: 15,
  },
  text: {
    color: "#595959",
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "bold",
  },
});
