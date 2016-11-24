import { StyleSheet } from "react-native";

const defaultNavBarSize = 64;
const defaultTabBarSize = 50;

export default (props, computedProps) =>
  StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: "#fff",
      marginTop: computedProps.hideNavBar ? 0 : defaultNavBarSize,
      marginBottom: (computedProps.hideTabBar || computedProps.hideTabBar === undefined) ? 0 : defaultTabBarSize,
    },
  })
