import React, { Component } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";

import {
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
  actionIcon: {
    marginRight: 18,
  },
  actionSubtitle: {
    color: "rgba(0, 0, 0, .7)",
    fontFamily: "lato",
    fontSize: 10,
    marginTop: 5,
  },
  actionTitle: {
    color: "#7705B9",
    flex: 3,
    fontFamily: "lato",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  full: {
    flex: 1,
    alignItems: "center",
  },
  defaultButtonContainer: {
    borderWidth: 1,
    borderColor: "#7705B9",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 170,
  },
  withIcon: {
    flexDirection: "row",
  },
});

export default class RoundedButton extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired,
    buttonStyle: ViewPropTypes.style,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    iconStyle: ViewPropTypes.style,
    subtitle: PropTypes.string,
    subtitleStyle: Text.propTypes.style,
    title: PropTypes.string.isRequired,
    titleStyle: Text.propTypes.style,
  };

  render() {
    const {
      action,
      buttonStyle,
      icon,
      iconColor,
      iconStyle,
      subtitle,
      subtitleStyle,
      title,
      titleStyle,
    } = this.props;

    return (
      <TouchableOpacity
        onPress={action}
      >
        <View style={styles.full}>
          <View style={[styles.defaultButtonContainer, buttonStyle]}>
            { icon &&
              <Icon
                name={icon}
                size={24}
                color= { iconColor ? iconColor : "#000" }
                style={[styles.actionIcon, iconStyle]}
              />
            }
            <View style={styles.titleContainer}>
              <Text style={[styles.actionTitle, titleStyle]}>{title.toUpperCase()}</Text>
            </View>
          </View>
          { subtitle &&
            <Text style={[styles.actionSubtitle, subtitleStyle]}>
              {subtitle}
            </Text>
          }
        </View>
      </TouchableOpacity>
    );
  }
}
