import React, { Component } from "react";
import { StyleSheet } from "react-native";

import Drawer from "react-native-drawer";
import LinearGradient from "react-native-linear-gradient";

const drawerStyles = {
  drawer: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  main: {
    backgroundColor: "white",
  },
};

const gradientStart = { x: 0.0, y: 0.25 };
const gradientEnd = { x: 1.0, y: 1.0 };
const gradientLocation = [0, 2.0];
const gradientColors = ["#3D3D3D", "#212121"];

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});


export default class Menu extends Component {
  static propTypes = {
    ...Drawer.propTypes,
  };

  static defaultProps = {
    tapToClose: true,
    type: "static",
    openDrawerOffset: 0.2,
    panOpenMask: 100,
    negotiatePan: true,
    tweenHandler: Drawer.tweenPresets.parallax,
  };

  render() {
    const {
      content,
      ...props
    } = this.props;

    const wrappedContent = (
      <LinearGradient
        start={gradientStart}
        end={gradientEnd}
        locations={gradientLocation}
        style={styles.full}
        colors={gradientColors}
      >
        {content}
      </LinearGradient>
    );

    return (
      <Drawer
        {...props}

        content={wrappedContent}
        ref={ref => this.drawer = ref}
        styles={drawerStyles}
      >
        {this.props.children}
      </Drawer>
    );
  }
}
