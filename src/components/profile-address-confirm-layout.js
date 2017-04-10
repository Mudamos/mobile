import React, { Component, PropTypes } from "react";

import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import styles from "../styles/profile-address-confirm-layout";

import MapView, { Marker } from "react-native-maps";

import Layout from "./purple-layout";
import BackButton from "./back-button";
import LinearGradient from "react-native-linear-gradient";
import HeaderLogo from "./header-logo";
import PurpleFlatButton from "./purple-flat-button";
import PageLoader from"./page-loader";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";

import { zipCodeMask } from "../utils";


const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;


export default class ProfileAddressConfirmLayout extends Component {
  static propTypes = {
    isSaving: PropTypes.bool,
    location: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  get locationAddress() {
    const { location } = this.props;
    return location && location.address;
  }

  get locationTitle() {
    const address = this.locationAddress;
    if (!address) return;

    return address.split(",")[0]
  }

  get locationDescription() {
    const address = this.locationAddress;
    if (!address) return;

    return address.split(",").slice(1).join(",").trim();
  }

  get zipCode() {
    const { location } = this.props;
    return zipCodeMask(location.zipCode);
  }

  render() {
    const {
      isSaving,
      onBack,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          {this.renderNavBar()}

          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>
              {locale.addressConfirmHeader}
            </Text>

            <Text style={styles.subHeader}>
              {locale.zipCodeReason}
            </Text>

            <View style={styles.zipCodeContainer}>
              <Text style={styles.zipCode}>
                {this.zipCode}
              </Text>

              <TouchableOpacity onPress={onBack} style={styles.wrongZipCodeContainer}>
                <Text style={styles.link}>{locale.wrongZipCode}</Text>
              </TouchableOpacity>
            </View>
          </View>

          { this.renderMap() }
        </Layout>

        <PageLoader isVisible={isSaving} />
      </View>
    );
  }

  renderNavBar() {
    const { onBack } = this.props;

    return (
      <NavigationBar
        leftView={<BackButton onPress={onBack} />}
        middleView={<HeaderLogo />}
      />
    );
  }

  renderMap() {
    const { location, onSave } = this.props;
    const { latitude, longitude } = location;

    return (
      <View style={styles.mapContainer}>
        <LinearGradient
          style={styles.mapShadow}
          colors={["#bababa", "transparent", "transparent"]}
        >
        </LinearGradient>
        <MapView style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            coordinate={{latitude, longitude}}
            title={this.locationTitle}
            description={this.locationDescription}
          />
        </MapView>

        <PurpleFlatButton
          title={locale.forward.toUpperCase()}
          onPress={() => onSave(location)}
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            marginHorizontal: 20,
          }}
        />
      </View>
    );
  }
}
