import React, { Component, PropTypes } from "react";

import {
  Keyboard,
  Text,
  View,
  StyleSheet,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

import Layout from "./layout";

import locale from "../locales/pt-BR";

import ZipCodeInput from "./zip-code-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from"./page-loader";

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = 0.0121;


export default class ProfileAddressLayout extends Component {

  state = {
    zipCode: null,
    hasKeyboard: false,
  }

  static propTypes = {
    isSearching: PropTypes.bool,
    location: PropTypes.object,
    onClearLocation: PropTypes.func.isRequired,
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
      isSearching,
      location,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "teal"}}>
        <PageLoader isVisible={isSearching} />

        <Layout contentStyle={{flexDirection: "column-reverse"}}>
          { location && this.renderResults() }

          <KeyboardAwareScrollView style={{flex: 1}} bounces={false} keyboardShouldPersistTaps={false}>
            <HeaderLogo />

            <Text style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "white",
              alignSelf: "center",
              marginBottom: 20}}>
              {locale.addressSearchHeader}
            </Text>

            {
              !location &&
                <View style={{marginHorizontal: 30}}>
                  <ZipCodeInput
                    value={this.state.zipCode}
                    onChangeZipCodeText={zipCode => this.setState({zipCode})}
                    placeholder={locale.zipCode}
                  />

                  <FlatButton
                    title="BUSCAR"
                    enabled={this.searchEnabled}
                    onPress={this.onSearch.bind(this)}
                    style={{marginTop: 20}}
                  />
                </View>
            }

            {
              location &&
                <View style={{marginHorizontal: 30}}>
                  <FlatButton
                    title="VOLTAR"
                    onPress={this.onClearLocation.bind(this)}
                  />
                </View>
            }

          </KeyboardAwareScrollView>

        </Layout>
      </View>
    );
  }

  renderResults() {
    const { location } = this.props;

    return (
      <View style={{flex: 1}}>
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

        <FlatButton
          title="CONFIRMAR"
          onPress={() => { console.log("Confirm") }}
          style={{position: "absolute", bottom: 30, left: 0, right: 0, marginHorizontal: 30}}
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

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", this.keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow () {
    this.setState({ hasKeyboard: true });
  }

  keyboardDidHide () {
    this.setState({ hasKeyboard: false });
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
