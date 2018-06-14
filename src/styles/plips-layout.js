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
  navigationBar: {
    backgroundColor: "#883DE1",
  },
  plipImage: {
    minWidth: windowWidth,
    ...StyleSheet.absoluteFillObject,
  },
  plipSubtitle: {
    ...plipSubtitle,
    fontSize: 14,
    marginTop: 8,
  },
  retryContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tableRow: {
    marginTop: 0,
  },
});
