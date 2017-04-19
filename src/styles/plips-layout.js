import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


export default StyleSheet.create({
  actionIcon: {
    marginRight: 18,
  },
  actionTitle: {
    color: "#fff",
    flex: 3,
    fontFamily: "lato",
    fontSize: 15,
    fontWeight: "bold",
  },
  actionRow: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 27,
  },
  footerContainer: {
    flex: 1,
    paddingHorizontal: 27,
  },
  full: {
    flex: 1,
  },
  hairline: {
    borderBottomColor: "rgba(255,255,255,0.23)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  link: {
    color: "#00c084",
    fontFamily: "lato",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  listView: {
    flex: 1,
  },
  navigationBar: {
    backgroundColor: "#883DE1",
  },
  noProjectsContainer: {
    flex: 1,
    justifyContent: "space-around",
    paddingHorizontal: 33,
  },
  noProjectsInnerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  noProjectsIcon: {
    marginVertical: 10,
  },
  noProjectsText: {
    color: "#9a9a9a",
    fontFamily: "lato",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
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
  rowContainer: {
    backgroundColor: "black",
  },
  tableRow: {
    marginTop: 0,
  },
  subTabContainer: {
    height: 36,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  subItem: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 12,
    fontWeight: "bold",
  },
  subTabItemContainer: {
    borderRadius: 100,
    backgroundColor: "rgba(70,70,70,0.51)",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 1,
    alignItems: "center",
  },
  tabItem: {
    fontFamily: "lato",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabsContainer: {
    height: 36,
    backgroundColor: "#292929",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
