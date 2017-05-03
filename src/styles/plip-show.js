import { Platform, StyleSheet } from "react-native";

export const IMAGE_HEIGHT = 380;
export const SMALL_ANIM_OFFSET = 50;
export const HEADER_OFFSET = 20;
export const HEADER_MAX_HEIGHT = IMAGE_HEIGHT - HEADER_OFFSET;
export const HEADER_MIN_HEIGHT = 0;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const IMAGE_HEIGHT_WITH_LEAK = IMAGE_HEIGHT + (HEADER_OFFSET * 2);

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
  fontSize: 24,
};

const infoTextSubtitle = {
  color: "#c7c7c7",
  fontFamily: "lato",
  fontSize: 13,
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
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    height: (SIGN_BUTTON_HEIGHT / 2) + SIGN_BUTTON_SHADOW_OFFSET,
  },
  infoFakeTop: {
    backgroundColor: "#000",
    height: SIGN_BUTTON_HEIGHT / 2,
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
    fontFamily: "pt sans",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "left",
    ...textShadow,
  },
  navigationBar: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
  },
  presentation: {
    color: "#313131",
    fontFamily: "pt sans",
    fontSize: 17,
  },
  presentationContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  progress: {
    height: 14,
    flex: 1,
    backgroundColor: "#484848",
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
  signersBubble: {
    alignSelf: "flex-end",
    marginVertical: 10,
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
})
