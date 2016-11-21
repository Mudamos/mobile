import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  color: {
    backgroundColor: "lightgray",
  },
  spacer: {
    ...Platform.select({
      ios: { height: 20 },
      android: { height: 0 },
    }),
  },
  transparent: {
    backgroundColor: "rgba(0,0,0,0)",
  },
});
