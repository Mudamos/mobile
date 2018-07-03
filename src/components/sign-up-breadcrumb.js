import React from "react";

import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from "react-native";

import PropTypes from "prop-types";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcons from "react-native-vector-icons/Ionicons";

import locale from "../locales/pt-BR";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  highlight: {
    backgroundColor: "#00BFD8",
  },
  icon: {
    backgroundColor: "#AAA",
    borderRadius: 20,
    padding: 4,
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  text: {
    fontSize: 10,
    color: "#FFF",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 32,
  },
  textConclude: {
    position: "absolute",
    top: 40,
    left: 282,
  },
  textHighlight: {
    fontWeight: "500",
  },
  textIdentification: {
    position: "absolute",
    top: 40,
    left: 26,
  },
  textLocality: {
    position: "absolute",
    top: 40,
    left: 198,
  },
  textProfileData: {
    position: "absolute",
    top: 40,
    left: 104,
  },
});

const iconSize = 26;
const defaultColor = "#FFF";

const SignUpBreadCrumb = props => {
  const {
    containerStyle,
    highlightId,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="face" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 1 && styles.highlight]} />
        <IonIcons name="ios-arrow-round-forward" size={iconSize} color={defaultColor} />
        <MaterialIcons name="person" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 2 && styles.highlight]} />
        <IonIcons name="ios-arrow-round-forward" size={iconSize} color={defaultColor} />
        <MaterialCommunityIcons name="pin" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 3 && styles.highlight]} />
        <IonIcons name="ios-arrow-round-forward" size={iconSize} color={defaultColor} />
        <MaterialCommunityIcons name="check-outline" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 4 && styles.highlight]} />
      </View>
      <Text style={[styles.text, styles.textIdentification, highlightId === 1 && styles.textHighlight]}>{locale.identification}</Text>
      <Text style={[styles.text, styles.textProfileData, highlightId === 2 && styles.textHighlight]}>{locale.profileData}</Text>
      <Text style={[styles.text, styles.textLocality, highlightId === 3 && styles.textHighlight]}>{locale.locality}</Text>
      <Text style={[styles.text, styles.textConclude, highlightId === 4 && styles.textHighlight]}>{locale.conclude}</Text>
    </View>
  );
}

SignUpBreadCrumb.propTypes = {
  containerStyle: ViewPropTypes.style,
  highlightId: PropTypes.number,
};

export default SignUpBreadCrumb;
