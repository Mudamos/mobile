import React from "react";

import {
  Text,
  View,
  ViewPropTypes,
} from "react-native";

import PropTypes from "prop-types";

import EStyleSheet from "react-native-extended-stylesheet";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcons from "react-native-vector-icons/Ionicons";

import locale from "../locales/pt-BR";

const styles = EStyleSheet.create({
  arrowIcon: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginHorizontal: -10,
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
    borderRadius: 16,
    padding: 4,
    width: 32,
    height: 32,
    overflow: "hidden",
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  iconContainer: {
    width: "20%",
    alignItems: "center",
    marginHorizontal: 4,
  },
  text: {
    fontFamily: "roboto",
    fontSize: "0.6rem",
    marginTop: 13,
    alignSelf: "center",
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

const iconSize = 24;
const arrowSize = iconSize;
const defaultColor = "#FFF";

const Arrow = () => (
  <IonIcons name="ios-arrow-round-forward" size={arrowSize} style={styles.arrowIcon} color={defaultColor} />
);

const SignUpBreadCrumb = props => {
  const {
    containerStyle,
    highlightId,
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconsContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="face" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 1 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 1 && styles.textHighlight]}>{locale.identification}</Text>
        </View>

        <Arrow />

        <View style={styles.iconContainer}>
          <MaterialIcons name="person" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 2 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 2 && styles.textHighlight]}>{locale.profileData}</Text>
        </View>

        <Arrow />

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="pin" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 3 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 3 && styles.textHighlight]}>{locale.voteLocation}</Text>
        </View>

        <Arrow />

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="map-marker" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 4 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 4 && styles.textHighlight]}>{locale.locality}</Text>
        </View>

        <Arrow />

        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="check-outline" size={iconSize} color={defaultColor} style={[styles.icon, highlightId === 5 && styles.highlight]} />
          <Text style={[styles.text, highlightId === 5 && styles.textHighlight]}>{locale.conclude}</Text>
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
