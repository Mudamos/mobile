import React, { useCallback, useEffect, useRef, useState } from "react";

import { Animated, AppState, StyleSheet, Text, View } from "react-native";

import { useTrackingTransparencyService } from "../hooks";
import RoundedButton from "./rounded-button";

import { log } from "../utils";

import locale from "../locales/pt-BR";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#00BFD8",
  },
  buttonPanel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .4)",
    elevation: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 40,
  },
  descriptionContainer: {
    paddingHorizontal: 10,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: "#7705B9",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  text: {
    color: "#FFF",
    fontFamily: "roboto",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "center",
  },
});

const useIsOnForeground = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const onChange = (state) => (appState.current = state);
    AppState.addEventListener("change", onChange);

    return () => {
      AppState.removeEventListener("change", onChange);
    };
  }, []);

  return {
    isOnForeground: appState.current === "active",
  };
};

const useShowAppModal = () => {
  const [showAppModal, setShowAppModal] = useState(false);

  const fadeAnimation = useRef(new Animated.Value(0));
  const slideAnimation = useRef(new Animated.Value(-280));

  useEffect(() => {
    if (showAppModal) {
      Animated.sequence([
        Animated.timing(fadeAnimation.current, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnimation.current, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (slideAnimation.current === 0) {
      Animated.sequence([
        Animated.timing(slideAnimation.current, {
          toValue: -300,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnimation.current, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [showAppModal]);

  return {
    showAppModal,
    setShowAppModal,
    fadeAnimation: fadeAnimation.current,
    slideAnimation: slideAnimation.current,
  };
};

const useRequestTracking = ({ trackingTransparency, setShowAppModal }) => {
  const { isOnForeground } = useIsOnForeground();

  useEffect(() => {
    if (isOnForeground) {
      (async () => {
        const isEnabled = await trackingTransparency.isEnabled();
        const canRequest = await trackingTransparency.canRequest();

        log({ isEnabled, canRequest }, { tag: "TrackingTransparency" });

        if (!isEnabled && canRequest) {
          setShowAppModal(true);
        }
      })();
    }
  }, [isOnForeground, trackingTransparency, setShowAppModal]);
};

const TrackingTransparencyModal = () => {
  const { trackingTransparency } = useTrackingTransparencyService();

  const {
    showAppModal,
    setShowAppModal,
    fadeAnimation,
    slideAnimation,
  } = useShowAppModal();

  const onShowSystemModal = useCallback(() => {
    setShowAppModal(false);
    trackingTransparency.requestPermission();
  }, [trackingTransparency, setShowAppModal]);

  useRequestTracking({ trackingTransparency, setShowAppModal });

  if (!showAppModal) {
    return false;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <Animated.View style={[styles.modal, { bottom: slideAnimation }]}>
        <Text style={[styles.text, styles.title]}>
          {locale.appTrackingTransparencyModalTitle}
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.text, styles.description]}>
            {locale.appTrackingTransparencyModalDescription}
          </Text>
        </View>

        <View style={styles.buttonPanel}>
          <RoundedButton
            title={locale.continue}
            action={onShowSystemModal}
            buttonStyle={styles.button}
            titleStyle={styles.text}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default TrackingTransparencyModal;
