import React, { Component } from "react";

import {
  Image,
  Text,
  View,
} from "react-native";

import Layout from "./layout";


export default class ProfileAddressLayout extends Component {
  render() {
    return (
      <View style={{flex: 1, backgroundColor: "teal"}}>
        <Layout>
          <Image source={require("../images/Logo.png")} style={{ alignSelf: "center", marginVertical: 5 }}/>

          <Text style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "white",
            alignSelf: "center",
            marginBottom: 20}}>Informe seu CEP</Text>


        </Layout>
      </View>
    );
  }
}
