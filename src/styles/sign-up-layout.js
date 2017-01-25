import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
  },
  container: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerTitle: {
    alignSelf: "center",
    color: "#fff",
    fontSize: 20,
    marginHorizontal: 12,
    textAlign: "center",

    ...Platform.select({
      ios: {
        fontFamily: "roboto-light",
      },
      android: {
        fontFamily: "roboto_light",
      },
    }),
  },
  inputContainer: {
    marginHorizontal: 33,
  },
  lightText: {
    alignSelf: "center",
    color: "rgba(255, 255, 255, 0.71)",
    fontFamily: "roboto",
    fontSize: 16,
    textAlign: "center",
  },
  login: {
    alignSelf: "center",
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separatorContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  separatorLine: {
    borderBottomColor: "rgba(255,255,255,0.23)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 3,
  },
  separatorText: {
    color: "#fff",
    fontFamily: "roboto",
    fontSize: 14,
    marginHorizontal: 8,
    opacity: 0.7,
    textAlign: "center",
  },
  signInContainer: {
    marginTop: 10,
  },
});
