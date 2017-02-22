import React, { Component, PropTypes } from "react";

import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import styles from "../styles/profile-address-layout";

import Layout from "./purple-layout";
import ScrollView from "./scroll-view";
import ZipCodeInput from "./zip-code-input";
import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from"./page-loader";
import NavigationBar from "./navigation-bar";

import locale from "../locales/pt-BR";


export default class ProfileAddressLayout extends Component {
  state = {
    zipCode: null,
  }

  static propTypes = {
    isFetchingLocation: PropTypes.bool,
    isSearching: PropTypes.bool,
    onDontKnowZipCode: PropTypes.func.isRequired,
    onRequestLocation: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
  }

  get validSearch() {
    return String(this.state.zipCode).length === 9;
  }

  get searchEnabled() {
    return this.validSearch;
  }

  componentDidMount() {
    const { onRequestLocation } = this.props;
    onRequestLocation({ message: locale.permissions.locationForZipCode });
  }

  render() {
    const {
      isFetchingLocation,
      isSearching,
    } = this.props;

    return (
      <View style={styles.container}>
        <Layout>
          <ScrollView>
            {this.renderNavBar()}
            {this.renderContent()}
          </ScrollView>
        </Layout>

        <PageLoader isVisible={isFetchingLocation || isSearching} />
      </View>
    );
  }

  renderContent() {
    const {
      onDontKnowZipCode,
    } = this.props;

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>
          {locale.addressSearchHeader}
        </Text>

        <ZipCodeInput
          value={this.state.zipCode}
          hint="Ex: 00000-000"
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
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        middleView={<HeaderLogo />}
      />
    );
  }

  onSearch() {
    const { zipCode } = this.state;
    const { onSearch } = this.props;

    onSearch(zipCode);
  }
}
