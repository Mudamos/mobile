import React, { Component, PropTypes } from "react";

import {
  Text,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Layout from "./layout";
import PageLoader from "./page-loader";

import { FBLogin } from "react-native-facebook-login";
import FBLoginView from "./fb-login-view";
import TextInput from "./text-input";

import locale from "../locales/pt-BR";


class SignInLayout extends Component {
  static propTypes = {
    currentAuthToken: PropTypes.string,
    facebookPermissions: PropTypes.array,
    facebookUser: PropTypes.object,
    isLoggingIn: PropTypes.bool,
    onFacebookError: PropTypes.func.isRequired,
    onFacebookLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
  }

  state = {};

  render() {
    const {
      currentAuthToken,
      isLoggingIn,
      onLogout,
      onSignUp,
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "#f7c44c"}}>
        <PageLoader isVisible={isLoggingIn} />

        <Layout>
          <KeyboardAwareScrollView>
            <Text style={{fontSize: 24, fontWeight: "bold", paddingTop: 15, paddingBottom: 15, textAlign: "center"}}>Mudamos</Text>

            <View style={{paddingHorizontal: 20}}>
              <TextInput
                label={locale.email}
                value={this.state.email}
                onChangeText={name => this.setState({ name })}
              />

              <TextInput
                label={locale.password}
                value={this.state.password}
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />

              {this.renderFBLogin()}

              {
                !!currentAuthToken &&
                  <Text style={{ alignSelf: "center", marginTop: 20, color: "lightblue", textAlign: "center"}} onPress={onLogout}>
                    Logout
                  </Text>
              }

              <Text style={{marginTop: 40, color: "lightblue", textAlign: "center"}} onPress={onSignUp}>
                Ainda não tem conta?
              </Text>
              <Text style={{color: "lightblue", fontWeight: "bold", textAlign: "center"}} onPress={onSignUp}>
                Cadastre-se
              </Text>
              <Text style={{textAlign: "center"}}>
                {currentAuthToken}
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  renderFBLogin() {
    const {
      currentAuthToken,
      facebookUser,
      facebookPermissions,
      onFacebookLogin,
      onFacebookError,
    } = this.props;

    if (currentAuthToken) return null;

    return (
      <FBLogin style={{ marginBottom: 10, alignSelf: "center" }}
        buttonView={<FBLoginView style={{alignSelf: "center"}} isLoggedIn={!!facebookUser} />}
        permissions={facebookPermissions}
        onLogin={onFacebookLogin}
        onError={onFacebookError}
      />
    );
  }
}

export default SignInLayout;
