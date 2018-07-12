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
  arrowIcon: {
    marginTop: 6,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  highlight: {
    backgroundColor: "#00BFD8",
  },
  icon: {
    backgroundColor: "#AAA",
    borderRadius: 18,
    padding: 4,
    width: 34,
    height: 34,
    overflow: "hidden",
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 90,
    alignItems: "center",
    marginHorizontal: -10,
  },
  text: {
    fontSize: 10,
    marginTop: 10,
    color: "#FFF",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  textHighlight: {
    fontWeight: "500",
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
      <View style={styles.iconsContainer}>
        <View style={[styles.iconContainer, {marginHorizontal: -10}]}>
          <MaterialIcons name="face" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 1 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 1 && styles.textHighlight]}>{locale.identification}</Text>
        </View>
        <IonIcons name="ios-arrow-round-forward" size={iconSize} style={styles.arrowIcon} color={defaultColor} />
        <View style={[styles.iconContainer, {marginHorizontal: -10}]}>
          <MaterialIcons name="person" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 2 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 2 && styles.textHighlight]}>{locale.profileData}</Text>
        </View>
        <IonIcons name="ios-arrow-round-forward" size={iconSize} style={styles.arrowIcon} color={defaultColor} />
        <View style={[styles.iconContainer, {marginHorizontal: -10}]}>
          <MaterialCommunityIcons name="pin" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 3 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 3 && styles.textHighlight]}>{locale.locality}</Text>
        </View>
        <IonIcons name="ios-arrow-round-forward" size={iconSize} style={styles.arrowIcon} color={defaultColor} />
        <View style={[styles.iconContainer, {marginHorizontal: -10}]}>
          <MaterialCommunityIcons name="check-outline" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 4 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 4 && styles.textHighlight]}>{locale.conclude}</Text>
        </View>
      </View>
    </View>
  );
}

SignUpBreadCrumb.propTypes = {
  containerStyle: ViewPropTypes.style,
  highlightId: PropTypes.number,
};

export default SignUpBreadCrumb;
