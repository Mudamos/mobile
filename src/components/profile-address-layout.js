import React, { PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import styles from "../styles/profile-address-layout";

import MapView, { Marker } from "react-native-maps";

import ComponentWithKeyboardEvent from "./component-with-keyboard-event";
import Layout from "./purple-layout";

import BackButton from "./back-button";

import locale from "../locales/pt-BR";

import ZipCodeInput from "./zip-code-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LinearGradient from "react-native-linear-gradient";

import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PurpleFlatButton from "./purple-flat-button";
import PageLoader from"./page-loader";

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;


export default class ProfileAddressLayout extends ComponentWithKeyboardEvent {

  state = {
    zipCode: null,
  }

  static propTypes = {
    isSaving: PropTypes.bool,
    isSearching: PropTypes.bool,
    location: PropTypes.object,
    onClearLocation: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  get validSearch() {
    return String(this.state.zipCode).length === 9;
  }

  get searchEnabled() {
    return this.validSearch && !this.state.hasKeyboard;
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

  render() {
    const {
      isSaving,
      isSearching,
      location,
    } = this.props;

    return (
      <View style={styles.container}>
        <PageLoader isVisible={isSearching || isSaving} />

        <Layout contentStyle={styles.layoutContentStyle}>
          { location && this.renderResults() }

          <KeyboardAwareScrollView style={styles.scrollView} bounces={false}>
            <HeaderLogo />
            {
              location &&
                <BackButton
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 0,
                  }}
                  onPress={this.onClearLocation.bind(this)}
                />
            }

            <Text style={styles.headerTitle}>
              {locale.addressSearchHeader}
            </Text>

            {
              !location &&
                <View>
                  <Text style={styles.subHeader}>
                    {locale.zipCodeReason}
                  </Text>

                  <ZipCodeInput
                    value={this.state.zipCode}
                    onChangeZipCodeText={zipCode => this.setState({zipCode})}
                    placeholder={locale.zipCode}
                    mdContainerStyle={{marginHorizontal: 13}}
                  />

                  <FlatButton
                    title={locale.search.toUpperCase()}
                    enabled={this.searchEnabled}
                    onPress={this.onSearch.bind(this)}
                    style={{marginTop: 20}}
                  />
                </View>
            }

            {
              location &&
                <Text style={styles.zipCode}>
                  {this.state.zipCode}
                </Text>
            }

          </KeyboardAwareScrollView>

        </Layout>
      </View>
    );
  }

  renderResults() {
    const { location, onSave } = this.props;

    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.mapShadow}
          colors={["#bababa", "transparent", "transparent"]}
        >
        </LinearGradient>
        <MapView style={styles.map}
          initialRegion={{
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Marker
            coordinate={{latitude: location.lat, longitude: location.lng}}
            title={this.locationTitle}
            description={this.locationDescription}
          />
        </MapView>

        <PurpleFlatButton
          title={locale.confirm.toUpperCase()}
          onPress={() => onSave(location.zipcode)}
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

  onSearch() {
    const { zipCode } = this.state;
    const { onSearch } = this.props;

    onSearch(zipCode);
  }

  onClearLocation() {
    const { onClearLocation } = this.props;

    this.setState({ zipCode: null });
    onClearLocation();
  }
}
