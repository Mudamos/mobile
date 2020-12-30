import PropTypes from "prop-types";
import React, { Component } from "react";

import { compose, withHandlers, withStateHandlers } from "recompose";

import { Keyboard, TouchableOpacity, Text, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

import { zipCodeMask } from "../utils";

import styles from "../styles/profile-address-layout";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import ZipCodeInput from "./zip-code-input";
import HeaderLogo from "./header-logo";
import PageLoader from "./page-loader";
import NavigationBar from "./navigation-bar";
import SignUpBreadCrumb from "./sign-up-breadcrumb";
import StaticFooter from "./static-footer";
import BackButton from "./back-button";
import RoundedButton from "./rounded-button";
import SafeAreaView from "./safe-area-view";

import locale from "../locales/pt-BR";

const zipCodeContainerStyle = { marginHorizontal: 13 };

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const hasCoordinates = (location) =>
  location && location.latitude && location.longitude;

const enhance = compose(
  withStateHandlers(
    { zipCode: "" },
    {
      onSetZipCode: () => (value) => ({
        zipCode: value,
      }),
    },
  ),
  withHandlers({
    onSearch: ({ zipCode, onSearch }) => () => {
      Keyboard.dismiss();
      onSearch(zipCode);
    },
    onSave: ({ location, onSave }) => () => {
      Keyboard.dismiss();
      onSave(location);
    },
  }),
);

class ProfileAddressLayout extends Component {
  static propTypes = {
    isFetchingLocation: PropTypes.bool,
    isSaving: PropTypes.bool,
    isSearching: PropTypes.bool,
    location: PropTypes.object,
    zipCode: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onDontKnowZipCode: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRequestLocation: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSetZipCode: PropTypes.func.isRequired,
  };

  get validSearch() {
    const { zipCode } = this.props;

    return String(zipCode).length === 9;
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

    return address.split(",")[0];
  }

  get locationDescription() {
    const address = this.locationAddress;
    if (!address) return;

    return address.split(",").slice(1).join(",").trim();
  }

  componentDidUpdate(prevProps) {
    const { zipCode, onSearch, onSetZipCode, location } = this.props;

    if (prevProps.zipCode !== zipCode || prevProps.location !== location) {
      if (location && !prevProps.location) {
        onSetZipCode(zipCodeMask(location.zipCode));
      }
      if (
        this.searchEnabled &&
        prevProps.zipCode !== zipCode &&
        zipCode.length === 9
      ) {
        onSearch();
      }
    }
  }

  componentDidMount() {
    const { onRequestLocation } = this.props;

    onRequestLocation({ message: locale.permissions.locationForZipCode });
  }

  render() {
    const { isFetchingLocation, isSaving, isSearching, onOpenURL } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}

            <SignUpBreadCrumb
              highlightId={3}
              containerStyle={styles.breadcrumb}
            />

            {this.renderContent()}

            <StaticFooter onOpenURL={onOpenURL} />
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isFetchingLocation || isSearching || isSaving} />
      </SafeAreaView>
    );
  }

  renderContent() {
    const { location, onSave } = this.props;

    return (
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{locale.addressSearchHeader}</Text>
          <Text style={styles.headerSubTitle}>
            {locale.addressSearchSubtitle}
          </Text>
        </View>

        {this.renderZipCodeInput()}

        {!hasCoordinates(location) && this.renderAddress()}

        <View style={styles.buttonContainer}>
          <RoundedButton
            title={locale.continue}
            enabled={this.searchEnabled}
            action={onSave}
            buttonStyle={styles.continueButton}
            titleStyle={styles.continueButtonTitle}
          />
        </View>

        {hasCoordinates(location) && this.renderMap()}
      </View>
    );
  }

  renderZipCodeInput() {
    const { onDontKnowZipCode, onSetZipCode, zipCode } = this.props;

    return (
      <View style={styles.zipCodeContainer}>
        <ZipCodeInput
          value={zipCode}
          hint="Ex: 00000-000"
          onChangeZipCodeText={onSetZipCode}
          placeholder={locale.zipCode}
          mdContainerStyle={zipCodeContainerStyle}
          onSubmitEditing={() => this.zipInput.blur()}
          ref={(ref) => (this.zipInput = ref)}
        />

        <TouchableOpacity
          onPress={onDontKnowZipCode}
          style={styles.dontRememberZipCodeContainer}>
          <Text style={styles.dontRememberZipCode}>
            {locale.dontRememberZipCode}
          </Text>
        </TouchableOpacity>
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
    const {
      location: { latitude, longitude },
    } = this.props;

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          scrollEnabled={false}
          zoomEnabled={false}
          region={{
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{ latitude, longitude }}
            title={this.locationTitle}
            description={this.locationDescription}
          />
        </MapView>
      </View>
    );
  }

  renderAddress() {
    const { location } = this.props;
    if (!location || !location.address) return;

    return (
      <View style={styles.addressContainer}>
        <Text style={styles.address}>
          <Text style={styles.addressItem}>{locale.address}:</Text>{" "}
          {location.address}
        </Text>
      </View>
    );
  }
}

export default enhance(ProfileAddressLayout);
