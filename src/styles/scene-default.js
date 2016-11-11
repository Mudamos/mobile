import { StyleSheet } from "react-native";

const defaultNavBarSize = 64;
const defaultTabBarSize = 50;

export default (props, computedProps) => ({
  flex: 1,
  backgroundColor: "#fff",
  marginTop: computedProps.hideNavBar ? 0 : defaultNavBarSize,
  marginBottom: computedProps.hideTabBar ? 0 : defaultTabBarSize,
});
