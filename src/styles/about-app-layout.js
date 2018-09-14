import { StyleSheet, Platform } from "react-native";

import EStyleSheet from "react-native-extended-stylesheet";

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
    fontWeight: "bold",
    fontSize: "0.8rem",
    color: "#757575",
  },
  body: {
    backgroundColor: "#FFF",
  },
  buttonPanel: {
    flex: 1,
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  classifyQuestionView: {
    marginTop: 30,
    flex: 1,
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
  peopleImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    ...Platform.select({
      android: {
        height: 150,
      },
      ios: {
        height: 110,
      },
    }),
  },
  title: {
    color: "#757575",
    fontWeight: "bold",
    fontSize: "1rem",
    textAlign: "center",
  },
  titleContainer: {
    padding: 33,
  },
});