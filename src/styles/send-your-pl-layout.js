import EStyleSheet from "react-native-extended-stylesheet";

export const IMAGE_HEIGHT = 110;

export default EStyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  buttonInfo: {
    fontSize: "0.6rem",
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 33,
  },
  container: {
    flex: 1,
    backgroundColor: "#6000AA",
  },
  continueButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginTop: 20,
    marginBottom: 10,
  },
  continueButtonTitle: {
    fontSize: "0.8rem",
  },
  imageContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  instructions: {
    fontSize: "0.8rem",
    marginTop: 16,
  },
  instructionsContainer: {
    flex: 1,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    marginTop: 14,
    paddingHorizontal: 33,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
  },
});
