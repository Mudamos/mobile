import React, { Component, PropTypes } from "react";

import {
  View,
  Text,
} from "react-native";

import Layout from "./layout";
import TextInput from "./text-input";
import NavigationBar from "./navigation-bar";
import SimpleButton from "./simple-button";
import PageLoader from "./page-loader";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import locale from "../locales/pt-BR";
import { User } from "../models";

import { errorForField } from "../utils";


export default class SignUpLayout extends Component {
  state = {}

  static propTypes = {
    currenUser: PropTypes.instanceOf(User),
    errors: PropTypes.array,
    isSaving: PropTypes.bool,
    showEmail: PropTypes.bool,
    showPassword: PropTypes.bool,
    onSave: PropTypes.func,
  }

  constructor(props) {
    super(props);

    const user = props.currenUser || {};
    this.state.name = user.name;
    this.state.email = user.email
  }

  render() {
    const {
      errors,
      isSaving,
      showEmail,
      showPassword,
      onSave
    } = this.props;

    return (
      <View style={{flex: 1, backgroundColor: "#f7c44c"}}>
        <PageLoader isVisible={isSaving} />

        <Layout style={{backgroundColor: "red"}}>
          {this.renderNavBar()}

          <KeyboardAwareScrollView bounces={false} style={{backgroundColor: "blue"}}>
            <TextInput
              label={locale.name}
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
              hasError={!!errorForField("name", errors)}
              hint={errorForField("name", errors)}
            />

            { showEmail &&
                <TextInput
                  label={locale.email}
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  hasError={!!errorForField("email", errors)}
                  hint={errorForField("email", errors)}
                />
            }

            { showPassword &&
                <TextInput
                  label={locale.password}
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  secureTextEntry={true}
                  hasError={!!errorForField("password", errors)}
                  hint={errorForField("password", errors)}
                />
            }

            <SimpleButton
              onPress={this.submit.bind(this)}
            >
              Salvar
            </SimpleButton>
          </KeyboardAwareScrollView>
        </Layout>
      </View>
    );
  }

  renderNavBar() {
    const { navigationState } = this.props;

    return (
      <NavigationBar title={navigationState.title} />
    );
  }

  submit() {
    const { showEmail, showPassword } = this.props;
    const { name, email, password } = this.state;

    const payload = { name };

    if (showEmail) payload.email = email;
    if (showPassword) payload.password = password;

    this.props.onSave(payload);
  }
}
