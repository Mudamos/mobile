// This code was adapted from https://github.com/localz/react-native-searchbar

import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialIcons";
import { identity } from "ramda";

import locale from "../locales/pt-BR";

const INITIAL_TOP = Platform.OS === "ios" ? -80 : -60;

export default class Search extends Component {
  static propTypes = {
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    autoCapitalize: PropTypes.string,
    autoCorrect: PropTypes.bool,
    backButton: PropTypes.object,
    backButtonAccessibilityLabel: PropTypes.string,
    backCloseSize: PropTypes.number,
    backgroundColor: PropTypes.string,
    clearOnBlur: PropTypes.bool,
    clearOnHide: PropTypes.bool,
    clearOnShow: PropTypes.bool,
    closeButton: PropTypes.object,
    closeButtonAccessibilityLabel: PropTypes.string,
    data: PropTypes.array,
    editable: PropTypes.bool,
    focusOnLayout: PropTypes.bool,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    handleChangeText: PropTypes.func,
    heightAdjust: PropTypes.number,
    hideBack: PropTypes.bool,
    hideX: PropTypes.bool,
    iconColor: PropTypes.string,
    iosHideShadow: PropTypes.bool,
    iosPadding: PropTypes.bool,
    iosPaddingBackgroundColor: PropTypes.string,
    keyboardAppearance: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    selectionColor: PropTypes.string,
    showOnLoad: PropTypes.bool,
    textColor: PropTypes.string,
    onBack: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onHide: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onX: PropTypes.func,
  };

  static defaultProps = {
    data: [],
    placeholder: locale.defaultSearchBarPlaceholder,
    backButtonAccessibilityLabel: locale.defaultSearchBarBackButtonAccessibilityLabel,
    closeButtonAccessibilityLabel: locale.defaultSearchBarCloseButtonAccessibilityLabel,
    heightAdjust: 0,
    backgroundColor: "white",
    iconColor: "gray",
    textColor: "gray",
    selectionColor: "lightskyblue",
    placeholderTextColor: "lightgray",
    animate: true,
    animationDuration: 200,
    showOnLoad: false,
    hideBack: false,
    hideX: false,
    iosPadding: true,
    iosPaddingBackgroundColor: "transparent",
    iosHideShadow: false,
    clearOnShow: false,
    clearOnHide: true,
    clearOnBlur: false,
    focusOnLayout: true,
    autoCorrect: true,
    autoCapitalize: "sentences",
    keyboardAppearance: "default",
    fontFamily: "roboto",
    backCloseSize: 28,
    fontSize: 20,
    editable: true,
  };

  state = {
    input: "",
    show: this.props.showOnLoad,
    top: new Animated.Value(
      this.props.showOnLoad ? 0 : INITIAL_TOP + this.props.heightAdjust
    ),
  };

  getValue = () => {
    return this.state.input;
  };

  setValue = input => {
    return this.setState({ input })
  };

  show = () => {
    const { animate, animationDuration, clearOnShow } = this.props;
    if (clearOnShow) {
      this.setState({ input: "" });
    }
    this.setState({ show: true });
    if (animate) {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({ top: new Animated.Value(0) });
    }
  };

  hide = () => {
    const { onHide, animate, animationDuration } = this.props;
    if (onHide) {
      onHide(this.state.input);
    }
    if (animate) {
      Animated.timing(this.state.top, {
        toValue: INITIAL_TOP,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(this.doHide);
    } else {
      this.setState({ top: new Animated.Value(INITIAL_TOP) });
      this.doHide();
    }
  };

  doHide = () => {
    const { clearOnHide } = this.props;
    this.setState({ show: false });
    if (clearOnHide) {
      this.setState({ input: "" });
    }
  };

  handleX = () => {
    const { onX } = this.props;
    this.clearInput();
    if (onX) onX();
  };

  handleBlur = () => {
    const { onBlur, clearOnBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
    if (clearOnBlur) {
      this.clearInput();
    }
  };

  clearInput = () => {
    this.setState({ input: "" });
    this.onChangeText("");
  };

  onChangeText = input => {
    const { handleChangeText } = this.props;
    this.setState({ input });
    if (handleChangeText) {
      handleChangeText(input);
    }
  };

  setTextInput = input => this.textInput = input;

  onTextInputLayout = () => {
    const { focusOnLayout } = this.props;

    focusOnLayout && this.textInput && this.textInput.focus();
  }

  render() {
    const {
      placeholder,
      heightAdjust,
      backgroundColor,
      iconColor,
      textColor,
      selectionColor,
      placeholderTextColor,
      onBack,
      hideBack,
      hideX,
      iosPadding,
      iosPaddingBackgroundColor,
      iosHideShadow,
      onSubmitEditing,
      onFocus,
      autoCorrect,
      autoCapitalize,
      keyboardAppearance,
      fontFamily,
      backButton,
      backButtonAccessibilityLabel,
      closeButton,
      closeButtonAccessibilityLabel,
      backCloseSize,
      fontSize,
      editable,
    } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: this.state.top,
              },
            ],
          },
          { backgroundColor },
          { paddingTop: (Platform.OS === "android" ? 26 : 0)},
        ]}>
        {this.state.show && (
          <View style={styles.navWrapper}>
            {Platform.OS === "ios" &&
              iosPadding && <View style={{ height: 20, backgroundColor: iosPaddingBackgroundColor }} />}
            <View
              style={[
                styles.nav,
                { height: 52 + heightAdjust },
              ]}>
              {!hideBack && (
                <TouchableOpacity
                  accessible={true}
                  accessibilityComponentType="button"
                  accessibilityLabel={backButtonAccessibilityLabel}
                  onPress={onBack || this.hide}>
                  {backButton ? (
                    <View
                      style={{ width: backCloseSize, height: backCloseSize }}>
                      {backButton}
                    </View>
                  ) : (
                    <Icon
                      name="arrow-back"
                      size={backCloseSize}
                      style={{
                        color: iconColor,
                        padding: heightAdjust / 2 + 10,
                      }}
                    />
                  )}
                </TouchableOpacity>
              )}
              <TextInput
                ref={this.setTextInput}
                onLayout={this.onTextInputLayout}
                style={[
                  styles.input,
                  {
                    fontSize: fontSize,
                    color: textColor,
                    fontFamily: fontFamily,
                    marginLeft: hideBack ? 30 : 0,
                    marginTop: Platform.OS === "ios" ? heightAdjust / 2 + 10 : 0,
                  },
                ]}
                selectionColor={selectionColor}
                onChangeText={this.onChangeText}
                onSubmitEditing={onSubmitEditing || identity}
                onFocus={onFocus || identity}
                onBlur={this.handleBlur}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                fontStyle={this.state.input.length === 0 ? "italic" : "normal"}
                value={this.state.input}
                underlineColorAndroid="transparent"
                returnKeyType="search"
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                autoFocus={true}
                keyboardAppearance={keyboardAppearance}
                editable={editable}
              />
              <TouchableOpacity
                accessible={true}
                accessibilityComponentType="button"
                accessibilityLabel={closeButtonAccessibilityLabel}
                onPress={
                  hideX || this.state.input === "" ? null : this.handleX
                }>
                { closeButton ? (
                  <View style={{ width: backCloseSize, height: backCloseSize }}>
                    {closeButton}
                  </View>
                ) : (
                  <Icon
                    name={"close"}
                    size={backCloseSize}
                    style={{
                      color:
                        hideX || this.state.input === ""
                          ? backgroundColor
                          : iconColor,
                      padding: heightAdjust / 2 + 10,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    padding: 10,
  },
  navWrapper: {
    flex: 1,
  },
  nav: {
    ...Platform.select({
      android: {
        borderBottomColor: "lightgray",
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
    backgroundColor: "#FFF",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    flex: 1,
    ...Platform.select({
      ios: { height: 30, marginBottom: 8 },
      android: { height: 50 },
    }),
  },
});