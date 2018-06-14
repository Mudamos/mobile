import {
  Dimensions,
  StyleSheet,
} from "react-native";

const { width: windowWidth } = Dimensions.get("window");

export default StyleSheet.create({
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
  rowContainer: {
    backgroundColor: "#FFF",
  },
  plipImageView: {
    height: 200,
  },
  plipHeaderContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  plipHeaderContainerSigned: {
    backgroundColor: "#00BFD8",
  },
  plipHeaderContainerNotSigned: {
    backgroundColor: "#7705B9",
  },
  plipTitleContainer: {
    flex: 10,
  },
  plipTitle: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "pt sans",
    fontWeight: "bold",
  },
  plipSignedContainer: {
    flex: 1,
    flexBasis: 90,
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
