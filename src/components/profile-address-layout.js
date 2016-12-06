import React, { Component, PropTypes } from "react";

import {
  Keyboard,
  Text,
  View,
} from "react-native";

import Layout from "./layout";

import locale from "../locales/pt-BR";

import ZipCodeInput from "./zip-code-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";
import PageLoader from"./page-loader";

export default class ProfileAddressLayout extends Component {

  state = {
    zipCode: null,
    hasKeyboard: false,
  }

  static propTypes = {
    isSearching: PropTypes.bool,
    location: PropTypes.object,
    onSearch: PropTypes.func.isRequired,
  }

  get validSearch() {
    return String(this.state.zipCode).length === 9;
  }

  get searchEnabled() {
    return this.validSearch && !this.state.hasKeyboard;
  }

  render() {
    const {
      isSearching,
      location,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "teal"}}>
        <PageLoader isVisible={isSearching} />

        <Layout>
          <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={false}>
            <HeaderLogo />

            <Text style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "white",
              alignSelf: "center",
              marginBottom: 20}}>
              {locale.addressSearchHeader}
            </Text>

            <View style={{marginHorizontal: 30}}>
              <ZipCodeInput
                value={this.state.zipCode}
                onChangeZipCodeText={zipCode => this.setState({zipCode})}
                placeholder={locale.zipCode}
              />

              { location && <Text>{JSON.stringify(location)}</Text> }

              <FlatButton
                title="BUSCAR"
                enabled={this.searchEnabled}
                onPress={this.onSearch.bind(this)}
                style={{marginTop: 20}}
              />
            </View>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  onSearch() {
    const { zipCode } = this.state;
    const { onSearch } = this.props;

    onSearch(zipCode);
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
