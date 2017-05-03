import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

const { width: windowWidth } = Dimensions.get("window");

const textShadow = {
  textShadowColor: "rgba(0,0,0, 1)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

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
    paddingTop: 5,
  },
  listViewContent: {
    paddingHorizontal: 10,
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
    marginTop: 10,
    marginBottom: 25,
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
    ...StyleSheet.absoluteFillObject,
  },
  plipImageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  plipTitleContainer: {
    backgroundColor: "transparent",
    flex: 1,
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
    lineHeight: 60,
    marginVertical: 10,
    ...textShadow,
  },
  plipRow: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "#F9F9F9",
  },
  plipSubtitle: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 30,
    ...textShadow,

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
    marginBottom: 25,
    borderRadius: 3,
    backgroundColor: "#F9F9F9",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tableRow: {
    marginTop: 0,
  },
  signedContainer: {
    position: "absolute",
    top: 20,
    right: -45,
  },
  signedGradient: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    transform: [{rotate: "45deg"}],
  },
  signedText: {
    color: "white",
    fontFamily: "lato",
    fontSize: 18,
    fontWeight: "bold",
  },
  subTabContainer: {
    height: 36,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  subItem: {
    color: "#8934E5",
    fontFamily: "lato",
    fontSize: 12,
    fontWeight: "bold",
  },
  subTabItemContainer: {
    borderRadius: 100,
    backgroundColor: "#F3F3F3",
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
    backgroundColor: "#F3F3F3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
