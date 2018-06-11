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

const plipSubtitle = {
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
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  rowContainer: {
    backgroundColor: "#FFF",
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
  plipView: {
    flex: 1,
  },
  plipImageView: {
    height: 200,
  },
  plipTitleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },
  plipTitleContainerSigned: {
    backgroundColor: "#00BFD8",
  },
  plipTitleContainerNotSigned: {
    backgroundColor: "#7705B9",
  },
  plipTitle: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "pt sans",
    fontWeight: "bold",
    lineHeight: 60,
  },
  plipSignedContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  plipSignedText: {
    color: "#FFF",
    fontWeight: "200",
  },
  plipSubtitleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#FFF",
  },
  plipOptionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 25,
    backgroundColor: "#FFF",
  },
  plipSignatureContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  plipOptions: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  plipDetailsLinkContainer: {
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: "#0000001F",
    borderBottomWidth: 1,
    borderBottomColor: "#0000001F",
    backgroundColor: "#FFF",
  },
  plipDetailsLink: {
    color: "#7705B9",
    fontWeight: "bold",
  },
  signedIcon: {
    marginLeft: 8,
  },
  signaturesIcon: {
    marginRight: 10,
  },
  favoriteIcon: {
    marginHorizontal: 10,
  },
  shareIcon: {
    marginLeft: 10,
  },
});
