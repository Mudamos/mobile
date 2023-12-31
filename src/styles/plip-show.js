import { Platform, StyleSheet } from "react-native";

export const IMAGE_HEIGHT = 380;
export const SMALL_ANIM_OFFSET = 50;
export const HEADER_OFFSET = 20;
export const HEADER_MAX_HEIGHT = IMAGE_HEIGHT - HEADER_OFFSET;
export const HEADER_MIN_HEIGHT = 0;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const IMAGE_HEIGHT_WITH_LEAK = IMAGE_HEIGHT + HEADER_OFFSET * 2;

const SIGN_BUTTON_HEIGHT = 42;
const SIGN_BUTTON_SHADOW_OFFSET = 10;

const textShadow = {
  textShadowColor: "rgba(0,0,0, 1)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

const infoText = {
  color: "#fff",
  fontFamily: "lato",
  fontSize: 20,
};

const infoTextSubtitle = {
  color: "#c7c7c7",
  fontFamily: "lato",
  fontSize: 12,
};

const infoContainerRow = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export default StyleSheet.create({
  actionTitle: {
    color: "#6000AA",
    flex: 3,
    fontFamily: "lato",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionFullText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  actionRow: {
    backgroundColor: "transparent",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 27,
  },
  aditionalInfo: {
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  backgroundImage: {
    height: IMAGE_HEIGHT_WITH_LEAK,
    backgroundColor: "rgb(71, 57, 121)",
  },
  buttonInfo: {
    color: "rgba(0, 0, 0, .7)",
    fontFamily: "lato",
    fontSize: 10,
    marginTop: 5,
  },
  buttonPdfContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  buttonSignerListContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#rgba(0, 0, 0, .1)",
    marginVertical: 30,
    marginHorizontal: -15,
  },
  finalGoalText: {
    marginTop: 10,
    textAlign: "right",

    ...infoTextSubtitle,
  },
  footerContainer: {
    flex: 1,
    paddingHorizontal: 27,
  },
  full: {
    flex: 1,
  },
  fullGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  hairline: {
    borderBottomColor: "rgba(255,255,255,0.23)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 24,
    position: "absolute",
    top: 16,
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
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoContainerRow,
  infoNationalCauseContainerRow: {
    ...infoContainerRow,
    justifyContent: "space-around",
  },
  infoPercentageText: {
    ...infoText,
    color: "#00db5e",
    fontWeight: "bold",
  },
  infoPercentageSubtitle: {
    ...infoTextSubtitle,
    color: "#00db5e",
  },
  infoText: {
    ...infoText,
  },
  infoTextSubtitle: {
    ...infoTextSubtitle,
  },
  infoFakeBottom: {
    backgroundColor: "#fff",
    height: SIGN_BUTTON_HEIGHT / 2 + SIGN_BUTTON_SHADOW_OFFSET,
  },
  infoFakeTop: {
    backgroundColor: "#000",
    height: SIGN_BUTTON_HEIGHT / 2,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  mainContainer: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  mainContentContainer: {
    backgroundColor: "#7E52D8",
    flex: 1,
  },
  mainTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#6000AA",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  mainTitle: {
    flex: 3,
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 24,
    textAlign: "left",
    ...textShadow,
  },
  mainTitleOptions: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
  },
  favoriteIcon: {
    marginHorizontal: 10,
  },
  navigationBar: {
    position: "absolute",
    top: -50,
    paddingTop: 50,
    right: 0,
    left: 0,
    ...Platform.select({
      android: {
        height: 156,
      },
      ios: {
        height: 120,
      },
    }),
  },
  presentation: {
    color: "#313131",
    fontFamily: "pt sans",
    fontSize: 17,
  },
  description: {
    color: "#313131",
    fontFamily: "pt sans",
    fontSize: 19,
    fontWeight: "bold",
  },
  textContainer: {
    backgroundColor: "#fff",
  },
  progress: {
    borderColor: "#rgba(0, 0, 0, .1)",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    height: 34,
    flex: 1,
    backgroundColor: "#FFF",
  },
  progressText: {
    backgroundColor: "#FFF",
    paddingLeft: 5,
    paddingVertical: 6.5,
    position: "absolute",
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
    paddingTop: HEADER_MAX_HEIGHT,
    justifyContent: "flex-end",
  },
  signButton: {
    alignItems: "flex-end",
    bottom: 10,
    flex: 1,
    left: 10,
    position: "absolute",
    right: 10,
  },
  signaturesAndGoal: {
    color: "#000",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  signaturesAndGoalContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signersBubble: {
    alignSelf: "flex-end",
    marginTop: 20,
    marginRight: 10,
  },
  subtitle: {
    color: "#fff",
    fontSize: 22,
    textAlign: "left",
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
  textShadow: {
    ...textShadow,
  },
  video: {
    marginTop: 10,
    marginBottom: 30,
    height: 300,
  },
});
