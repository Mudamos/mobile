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
  actionTitle: {
    color: "#6000AA",
    fontFamily: "lato",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonDisable: {
    backgroundColor: "#AAA",
  },
  defaultButtonContainer: {
    borderWidth: 1,
    borderColor: "#6000AA",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleContainer: {
    maxWidth: 200,
  },
  withIcon: {
    flexDirection: "row",
  },
});

export default class RoundedButton extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired,
    buttonStyle: ViewPropTypes.style,
    enabled: PropTypes.bool,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    iconStyle: ViewPropTypes.style,
    title: PropTypes.string.isRequired,
    titleStyle: Text.propTypes.style,
  };

  static defaultProps = {
    enabled: true,
  }

  render() {
    const {
      action,
      enabled,
    } = this.props;

    if (enabled) {
      return (
        <TouchableOpacity
          onPress={action}
        >
          {this.renderButton()}
        </TouchableOpacity>
      );
    } else {
      return (
        <View>
          {this.renderButton()}
        </View>
      );
    }
  }

  renderButton() {
    const {
      buttonStyle,
      enabled,
      icon,
      iconColor,
      iconStyle,
      title,
      titleStyle,
    } = this.props;

    return(
      <View style={[styles.defaultButtonContainer, icon && styles.withIcon, buttonStyle, !enabled && styles.buttonDisable]}>
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
    );
  }
}
