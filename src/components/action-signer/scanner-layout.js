import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, View, StyleSheet, Text } from "react-native";
import { prop, tap } from "ramda";

import QRCodeScanner from "react-native-qrcode-scanner";
import Toast from "react-native-simple-toast";

import SafeAreaView from "../safe-area-view";
import Layout from "../purple-layout";
import NavigationBar from "../navigation-bar";
import BackButton from "../back-button";
import RoundedButton from "../rounded-button";
import HeaderLogo from "../header-logo";
import textStyles from "../../styles/text";
import locale from "../../locales/pt-BR";
import { log, isBlank } from "../../utils";
import { useOpenSettings, usePermissionService } from "../../hooks";

const data = prop("data");

const Marker = () => (
  <Image source={require("../../images/qrcode-mask.png")} style={styles.mask} />
);

const OpenSettingsButton = () => {
  const openSettings = useOpenSettings();

  return (
    <RoundedButton
      title={locale.openSettings.toUpperCase()}
      action={openSettings}
      buttonStyle={styles.actionButton}
      titleStyle={styles.actionButtonTitle}
    />
  );
};

const Unauthorized = () => {
  return (
    <View style={styles.unauthorized}>
      <Text style={styles.unauthorizedText}>
        {locale.cantScanQrCodeUnauthorized}
      </Text>
      <OpenSettingsButton />
    </View>
  );
};

const ScannerLayout = ({ hasFocus, onBack, onQrCodeScan }) => {
  const onRead = useCallback(
    (event) => {
      log(event);

      const qrCodeData = data(event);

      if (isBlank(qrCodeData)) {
        return Toast.show(locale.errorReadingQrCode);
      }

      onQrCodeScan(qrCodeData);
    },
    [onQrCodeScan],
  );

  const onMountError = useCallback(
    () => Toast.show(locale.errors.mountingCamera),
    [],
  );

  const camera = useRef();

  const cameraProps = useMemo(
    () => ({
      ref: camera,
      notAuthorizedView: <Unauthorized />,
      pendingAuthorizationView: <View />,
      onMountError,
      androidCameraPermissionOptions: {
        title: locale.qrCodeCameraPermissionTitle,
        message: locale.qrCodeCameraPermissionDescription,
        buttonPositive: locale.okIGotIt,
      },
    }),
    [onMountError, camera],
  );

  const { permissionService, STATUSES } = usePermissionService();

  useEffect(() => {
    if (hasFocus) {
      let cancelled = false;

      permissionService
        .checkStatus(permissionService.permissions.camera)
        .then((status) => status === STATUSES.AUTHORIZED)
        .then(
          tap((isEnabled) =>
            log({ isEnabled, cancelled, hasCamera: !!camera.current }),
          ),
        )
        .then(
          (isEnabled) =>
            !cancelled &&
            isEnabled &&
            camera.current &&
            camera.current.refreshAuthorizationStatus(),
        );

      return () => (cancelled = true);
    }
  }, [hasFocus, camera, permissionService, STATUSES.AUTHORIZED]);

  return (
    <SafeAreaView style={styles.container}>
      <Layout>
        <NavigationBar
          leftView={<BackButton onPress={onBack} />}
          middleView={<HeaderLogo />}
        />

        <View style={styles.full}>
          <Text style={styles.headerTitle}>{locale.qrCodeScanTitle}</Text>

          <QRCodeScanner
            showMarker
            reactivate
            reactivateTimeout={5000}
            customMarker={<Marker />}
            cameraStyle={styles.camera}
            topViewStyle={styles.hide}
            bottomViewStyle={styles.hide}
            onRead={onRead}
            notAuthorizedView={<Unauthorized />}
            cameraProps={cameraProps}
          />
        </View>
      </Layout>
    </SafeAreaView>
  );
};

ScannerLayout.propTypes = {
  hasFocus: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onQrCodeScan: PropTypes.func.isRequired,
};

export default ScannerLayout;

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: "#00BFD8",
  },
  actionButtonTitle: {
    color: "#FFF",
  },
  container: {
    backgroundColor: "#6000AA",
    flex: 1,
  },
  camera: {
    height: "100%",
    flex: 1,
  },
  headerTitle: StyleSheet.flatten([
    textStyles.header,
    { marginBottom: 8, marginTop: 12 },
  ]),
  hide: {
    flex: 0,
    height: 0,
  },
  full: {
    flex: 1,
  },
  mask: {
    height: 200,
    width: 200,
  },
  unauthorized: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  unauthorizedText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "roboto",
    marginBottom: 20,
  },
});
