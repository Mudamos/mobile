import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


export default StyleSheet.create({
  full: {
    flex: 1,
  },
  layoutContent: {
    backgroundColor: "black",
  },
  listView: {
    flex: 1,
  },
  navigationBar: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  navigationBarContainer: {
    backgroundColor: "transparent",
    height: 88,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  navigationBarGradient: {
    position: "absolute",
    flex: 1,
    height: 88,
    top: 0,
    left: 0,
    right: 0,
  },
  noProjects: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    textAlign: "center",
  },
  noProjectsHeader: {
    flex: 1,
    height: 333,
    justifyContent: "center",
    alignItems: "center",
  },
  plipImage: {
    minWidth: windowWidth,

    // We want to render the image as tall as possible, so we don't see its bounds when scrolling
    height: windowHeight,

    // This is just to proper position the images up high
    marginBottom: 100,
  },
  plipImageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  plipTitleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  plipTitleInnerContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  plipTitle: {
    color: "#fff",
    fontFamily: "pt sans",
    fontSize: 48,
    fontWeight: "bold",
  },
  plipSubtitle: {
    color: "#fff",
    fontSize: 22,

    ...Platform.select({
      ios: {
        fontFamily: "roboto-light",
      },
      android: {
        fontFamily: "roboto_light",
      },
    }),
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tableRow: {
    marginTop: 0,
  },
});
