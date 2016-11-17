import { StyleSheet } from "react-native";

const imageHeight = 350;

export default StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: "#fff",
    height: imageHeight
  },
  imageCall: {
    height: imageHeight,
    backgroundColor: "#fff"
  },
  foreGroundContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 5,
    paddingRight: 5
  },
  mainCycleTitle: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: "center",
    color: "#fff"
  },
  mainTitleContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },
  stickyHeader: {
    height: 64,
    backgroundColor: "purple",
    padding: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  navCycleTitle: {
    fontSize: 14,
    color: "#fff"
  }
})

export const parallaxScrollView = {
  stickyHeaderHeight: 64,
  parallaxHeaderHeight: imageHeight,
  backgroundColor: "#fff"
};
