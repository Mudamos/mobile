import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOffset: { height: 5 },
    shadowOpacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  link: {
    alignSelf: "flex-end",
    marginTop: 43,
    fontFamily: "roboto",
    fontSize: 14,
    fontWeight: "500",
    color: "#9013FE",
    lineHeight: 24,
  },
  logo: {
    margin: 0,
  },
  peopleImage: {
    justifyContent: "center",
    width: undefined,
    height: 110,
  },
  text: {
    fontFamily: "roboto",
    fontSize: 16,
    color: "rgba(0,0,0,0.54)",
    lineHeight: 24,
  },
  title: {
    fontFamily: "roboto",
    fontSize: 20,
    fontWeight: "400",
    color: "rgba(0,0,0,0.87)",
    marginBottom: 20,
  },
});
