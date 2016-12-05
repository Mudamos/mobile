import React, { Component } from "react";

import {
  Text,
  View,
  StyleSheet,
} from "react-native";

import Layout from "./layout";


import CepInput from "./cep-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import HeaderLogo from "./header-logo";
import FlatButton from "./flat-button";

export default class ProfileAddressLayout extends Component {
  state = {
    cep: null
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: "teal"}}>
        <Layout>
          <KeyboardAwareScrollView bounces={false}>
            <HeaderLogo />

            <Text style={{
              fontWeight: "bold",
              fontSize: 22,
              color: "white",
              alignSelf: "center",
              marginBottom: 20}}>Informe seu CEP</Text>

            <View style={{marginHorizontal: 30}}>
              <CepInput
                value={this.state.cep}
                onChangeCepText={cep => this.setState({cep})}
                placeholder="CEP"
                hasError={true}
                error="Some error"
              />

              <FlatButton
                title="BUSCAR"
                onPress={() => console.log('dance')}
                style={{marginTop: 20}}
              />
            </View>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }
}
