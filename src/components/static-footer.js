import React, { Component } from "react";

import { StyleSheet } from "react-native";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PropTypes from "prop-types";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  text: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "roboto",
  },
});

const securityMessage = "Este é um ambiente seguro e todas as suas informações estão protegidas."
const whatIsMudamos = "Mudamos é uma iniciativa do Instituto de Tecnologia e Sociedade do Rio de Janeiro (ITS Rio), premiada e financiada exclusivamente pelo prêmio Desafio Google de Impacto Social, conquistado em 2016."

export default class StaticFooter extends Component {
  static propTypes = {
    onOpenURL: PropTypes.func.isRequired,
  }

  render() {
    const {
      onOpenURL,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "#6000AA", paddingHorizontal: 20, paddingTop: 25, paddingBottom: 70}}>
        <View style={{flexDirection: "row", marginBottom: 20}}>
          <MaterialIcon
            name={"lock"}
            size={24}
            color="#FFF"
            style={{marginRight: 20}}
          />
          <View style={{flexGrow: 1, width: 0}}>
            <Text style={styles.text}>{securityMessage}</Text>
          </View>
        </View>
        <View style={{flexDirection: "row", marginBottom: 40}}>
          <Image
            source={require("../images/its-black-logo.png")}
            style={{marginRight: 20}}
          />
          <View style={{flexGrow: 1, width: 0}}>
            <Text style={styles.text}>{whatIsMudamos}</Text>
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "center"}}>
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
