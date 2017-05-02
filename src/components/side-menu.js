import React, { Component } from "react";

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
        start={[0.0, 0.25]}
        end={[1.0, 1.0]}
        locations={[0,2.0]}
        style={[{flex: 1}]}
        colors={["#3D3D3D", "#212121"]}
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
