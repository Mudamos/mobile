import React, { Component, PropTypes } from "react";

import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import styles from "../styles/profile-address-layout";

import MapView, { Marker } from "react-native-maps";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import BackButton from "./back-button";
import ZipCodeInput from "./zip-code-input";
import LinearGradient from "react-native-linear-gradient";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PurpleFlatButton from "./purple-flat-button";
import PageLoader from"./page-loader";

import locale from "../locales/pt-BR";


const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;


export default class ProfileAddressLayout extends Component {

  state = {
    zipCode: null,
  }

  static propTypes = {
    isSaving: PropTypes.bool,
    isSearching: PropTypes.bool,
    location: PropTypes.object,
    onClearLocation: PropTypes.func.isRequired,
    onDontKnowZipCode: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  get validSearch() {
    return String(this.state.zipCode).length === 9;
  }

  get searchEnabled() {
    return this.validSearch;
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
      onDontKnowZipCode,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout contentStyle={styles.layoutContentStyle}>
          { location && this.renderResults() }

          <ScrollView style={styles.scrollView}>
            <HeaderLogo />
            {
              location &&
                <BackButton
                  containerStyle={{
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
                    onSubmitEditing={() => this.zipInput.blur()}
                    ref={ref => this.zipInput = ref}
                  />

                  <TouchableOpacity onPress={onDontKnowZipCode} style={styles.dontRememberZipCodeContainer}>
                    <Text style={styles.dontRememberZipCode}>
                      {locale.dontRememberZipCode}
                    </Text>
                  </TouchableOpacity>

                  <FlatButton
                    title={locale.forward.toUpperCase()}
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

          </ScrollView>

        </Layout>

        <PageLoader isVisible={isSearching || isSaving} />
      </View>
    );
  }

  renderResults() {
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
