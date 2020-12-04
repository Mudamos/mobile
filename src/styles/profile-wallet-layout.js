import EStyleSheet from "react-native-extended-stylesheet";

export default EStyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  full: {
    flex: 1,
  },
  pressButton: {
    marginVertical: 10,
  },
  retryButton: {
    marginHorizontal: 20,
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  revalidateButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginHorizontal: 20,
    marginTop: 20,
  },
  revalidateContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
  },
  weNeed: {
    marginTop: 10,
  },
});
