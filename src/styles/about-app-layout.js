import { StyleSheet } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

export const IMAGE_HEIGHT = 110;

export default EStyleSheet.create({
  accordionContentContainer: {
    paddingHorizontal: 33,
    paddingBottom: 30,
  },
  accordionContentText: {
    fontSize: "0.8rem",
    color: "#757575",
    flex: 1,
  },
  accordionContentTextFooter: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  accordionHeaderChevron: {
    flex: 1,
    padding: 4,
  },
  accordionHeaderContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#757575",
    paddingHorizontal: 33,
    paddingVertical: 16,
  },
  accordionHeaderText: {
    flex: 9,
    fontSize: "0.8rem",
    color: "#000",
  },
  body: {
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    alignItems: "center",
    flex: 1,
  },
  buttonPanel: {
    flex: 1,
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  classifyQuestionView: {
    marginTop: 30,
  },
  classifyQuestionButton: {
    paddingHorizontal: 40,
  },
  classifyQuestionButtonTitle: {
    fontSize: "0.6rem",
  },
  goToMudamosSiteButton: {
    backgroundColor: "#00BFD8",
    borderWidth: 0,
    marginTop: 20,
    marginBottom: 10,
  },
  goToMudamosSiteTitle: {
    color: "#FFF",
    fontSize: "0.8rem",
  },
  container: {
    flex: 1,
    backgroundColor: "#6000AA",
  },
  footerContainer: {
    backgroundColor: "#E8E8E8",
    borderTopWidth: 1,
    borderColor: "#757575",
    paddingTop: 18,
  },
  moreAboutMudamos: {
    backgroundColor: "#FFF",
    paddingHorizontal: 33,
    paddingVertical: 16,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  moreAboutMudamosInfo: {
    fontSize: "0.6rem",
    textAlign: "center",
  },
  moreAboutMudamosTitle: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  navBarContainer: {
    height: IMAGE_HEIGHT,
  },
  peopleImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thanksForFeedback: {
    fontSize: "0.8rem",
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    color: "#000",
    fontWeight: "bold",
    fontSize: "1rem",
    textAlign: "center",
  },
  titleContainer: {
    padding: 33,
  },
});