import { StyleSheet } from "react-native";

export const IMAGE_HEIGHT = 380;
export const SMALL_ANIM_OFFSET = 50;
export const HEADER_OFFSET = 20;
export const HEADER_MAX_HEIGHT = IMAGE_HEIGHT - HEADER_OFFSET;
export const HEADER_MIN_HEIGHT = 0;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const IMAGE_HEIGHT_WITH_LEAK = IMAGE_HEIGHT + (HEADER_OFFSET * 2);


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
  actionSubtitle: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 11,
  },
  backgroundImage: {
    height: IMAGE_HEIGHT_WITH_LEAK,
    backgroundColor: "rgb(71, 57, 121)",
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  headerTitle: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 20,
    position: "absolute",
    top: 28,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  imageBackgroundContainer: {
    backgroundColor: "rgb(71, 57, 121)",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: IMAGE_HEIGHT_WITH_LEAK,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  logo: {
    marginTop: 20,
  },
  logoContainer: {
    backgroundColor: "transparent",
  },
  mainContentContainer: {
    backgroundColor: "#7E52D8",
    flex: 1,
  },
  mainTitle: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
  },
  menuButton: {
    position: "absolute",
    top: 30,
    left: 16,
  },
  navigationBar: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 85,
  },
  presentation: {
    color: "#313131",
    fontFamily: "roboto",
    fontSize: 17,
  },
  presentationContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 30,
  },
  projectSigned: {
    backgroundColor: "transparent",
    color: "#fff",
    fontFamily: "lato",
    fontSize: 21,
    fontWeight: "bold",
  },
  remainingDays: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  remainingDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  remainingDaysSubtitle: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollViewHeaderContainer: {
    backgroundColor: "transparent",
    flex: 1,
    height: HEADER_MAX_HEIGHT,
    justifyContent: "flex-end",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  signatures: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  signaturesCount: {
    color: "#fff",
    fontFamily: "lato",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  signedMessageContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    height: 58,
    justifyContent: "space-between",
    padding: 12,
  },
  subtitle: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 22,
    textAlign: "left",
  },
  userSignDate: {
    backgroundColor: "transparent",
    color: "#fff",
    fontFamily: "lato",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    width: 100,
  },
})
