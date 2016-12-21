import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    position: "absolute",
    backgroundColor: "#fff",
    right: 0,
    bottom: 0,
    left: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOffset: { height: 5 },
    shadowOpacity: 0.7,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  logo: {
    margin: 0,
  },
  peopleImage: {
    justifyContent: "center",
    width: undefined,
    height: 110,
  },
});
