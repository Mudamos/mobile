import React, { Component, PropTypes } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import FAIcon from "react-native-vector-icons/FontAwesome";

class FBLoginView extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <View style={style.container}>
        <FAIcon name="facebook" style={[style.facebookIcon, style.text]} size={20} />
        <Text style={style.text}>{isLoggedIn ? "Sair" : "Entrar com Facebook"}</Text>
      </View>
    )
  }
}

export default FBLoginView;

const style = StyleSheet.create({
  container: {
    backgroundColor:"#3b5998",
    padding: 10,
    flexDirection: "row",
    flex: 1,
  },
  facebookIcon: {
    marginRight: 10,
  },
  text: {
    color: "#fff",
  },
});
