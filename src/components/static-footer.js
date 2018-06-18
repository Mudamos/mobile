import React, { Component } from "react";

import { StyleSheet } from "react-native";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PropTypes from "prop-types";

import locale from "../locales/pt-BR";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  aboutMudamosContainer: {
    flexDirection: "row",
    marginBottom: 40,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#6000AA",
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 70,
  },
  securityInfoContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  text: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "roboto",
  },
  textContainer: {
    flexGrow: 1,
    width: 0,
  },
});

export default class StaticFooter extends Component {
  static propTypes = {
    onOpenURL: PropTypes.func.isRequired,
  }

  render() {
    const {
      onOpenURL,
    } = this.props;

    return (
      <View style={styles.mainContent}>
        <View style={styles.securityInfoContainer}>
          <MaterialIcon
            name={"lock"}
            size={24}
            color="#FFF"
            style={{marginRight: 20}}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{locale.securityMessage}</Text>
          </View>
        </View>
        <View style={styles.aboutMudamosContainer}>
          <Image
            source={require("../images/its-black-logo.png")}
            style={{marginRight: 20}}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{locale.whatIsMudamos}</Text>
          </View>
        </View>
        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() => onOpenURL("https://www.facebook.com/ITSriodejaneiro")}
          >
            <FontAwesomeIcon
              name={"facebook"}
              size={24}
              color="#FFF"
              style={{marginHorizontal: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onOpenURL("https://twitter.com/itsriodejaneiro")}
          >
            <FontAwesomeIcon
              name={"twitter"}
              size={24}
              color="#FFF"
              style={{marginHorizontal: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onOpenURL("https://www.instagram.com/itsriodejaneiro/")}
          >
            <FontAwesomeIcon
              name={"instagram"}
              size={24}
              color="#FFF"
              style={{marginHorizontal: 20}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
