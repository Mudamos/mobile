import React from "react";

import { compose, withHandlers } from "recompose";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PropTypes from "prop-types";

import locale from "../locales/pt-BR";

import EStyleSheet from "react-native-extended-stylesheet";

import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const styles = EStyleSheet.create({
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
    fontSize: "0.65rem",
    fontFamily: "roboto",
  },
  textContainer: {
    flexGrow: 1,
    width: 0,
  },
});

const enhance = compose(
  withHandlers({
    onFacebook: ({ onOpenURL }) => () => onOpenURL("https://www.facebook.com/mudamos/"),
    onInstagram: ({ onOpenURL }) => () => onOpenURL("https://www.instagram.com/itsriodejaneiro/"),
    onTwitter: ({ onOpenURL }) => () => onOpenURL("https://twitter.com/itsriodejaneiro"),
  })
);

const StaticFooter = ({ onFacebook, onInstagram, onTwitter }) => (
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
        onPress={onFacebook}
      >
        <FontAwesomeIcon
          name={"facebook"}
          size={24}
          color="#FFF"
          style={{marginHorizontal: 20}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onTwitter}
      >
        <FontAwesomeIcon
          name={"twitter"}
          size={24}
          color="#FFF"
          style={{marginHorizontal: 20}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onInstagram}
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

StaticFooter.propTypes = {
  onFacebook: PropTypes.func,
  onInstagram: PropTypes.func,
  onOpenURL: PropTypes.func.isRequired,
  onTwitter: PropTypes.func,
}

export default enhance(StaticFooter);