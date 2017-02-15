import { StyleSheet } from "react-native";

const ROW_HEIGHT = 130;
const ROW_BORDER_SIZE = 5;

export default StyleSheet.create({
  full: {
    flex: 1,
  },
  imageOverlay: {
    flex: 1,
    flexDirection: "column-reverse",
  },
  listView: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  navigationBar: {
    backgroundColor: "#883DE1",
  },
  noProjects: {
    color: "#595959",
    fontFamily: "roboto",
    fontSize: 14,
    textAlign: "center",
  },
  noProjectsHeader: {
    flex: 1,
    height: 100,
    justifyContent: "center",
  },
  plipImage: {
    height: ROW_HEIGHT - ROW_BORDER_SIZE * 2,
  },
  plipTitle: {
    color: "#fff",
    fontFamily: "pt sans",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  separator: {
    flex: 1,
    height: 20,
  },
  tableRow: {
    height: ROW_HEIGHT,
    borderRadius: 5,
    borderColor: "#fff",
    borderWidth: ROW_BORDER_SIZE,
  },
  titleContainer: {
    padding: 10,
    backgroundColor: "transparent",
  },
});
