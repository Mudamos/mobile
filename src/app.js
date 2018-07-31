import React, { Component } from "react";
import PropTypes from "prop-types";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import OneSignal from "react-native-onesignal";

import {
  ChangeForgotPasswordContainer,
  ChangePasswordContainer,
  ForgotPasswordContainer,
  PlipContainer,
  PlipsContainer,
  PlipViewerContainer,
  ProfileAddressContainer,
  ProfileConcludeContainer,
  ProfileUpdateContainer,
  ProfileSignUpContainer,
  ProfileWalletContainer,
  ShowVideoContainer,
  SignersContainer,
  SignInContainer,
  SignUpContainer,
  TSEContainer,
} from "./containers";

import {
  appDidMount,
  appWillUnmount,
  navigate,
  navigateBack,
} from "./actions";


import routeReducer from "./services/route-reducer";
import backAndroidHandler from "./back-android-handler";

import { Provider } from "react-redux";

OneSignal.inFocusDisplaying(2); // Show notification on drawer

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="plipsNav" initial={true} type="reset" hideNavBar={true}>
      <Scene key="plipsList" initial={true} component={PlipsContainer} hideNavBar={true} />
    </Scene>

    <Scene key="showPlip" component={PlipContainer} hideNavBar={true} />
    <Scene key="plipViewer" component={PlipViewerContainer} hideNavBar={true} title="Texto do projeto"/>
    <Scene key="signers" component={SignersContainer} hideNavBar={true} />

    <Scene key="signIn" component={SignInContainer} hideNavBar={true} />

    <Scene key="signUp" component={SignUpContainer} hideNavBar={true} title="Identificação" />
    <Scene key="profileSignUp" component={ProfileSignUpContainer} hideNavBar={true} title="Dados Pessoais"/>
    <Scene key="profileAddress" component={ProfileAddressContainer} hideNavBar={true} title="CEP" />
    <Scene key="profileWallet" component={ProfileWalletContainer} hideNavBar={true} duration={0} title="Wallet" />
    <Scene key="profileConclude" component={ProfileConcludeContainer} hideNavBar={true} title="Conclude" />

    <Scene key="forgotPassword" component={ForgotPasswordContainer} hideNavBar={true} />
    <Scene key="changeForgotPassword" component={ChangeForgotPasswordContainer} hideNavBar={true} />

    <Scene key="changePassword" component={ChangePasswordContainer} hideNavBar={true} />
    <Scene key="profileUpdate" component={ProfileUpdateContainer} hideNavBar={true} />

    <Scene key="tse" component={TSEContainer} hideNavBar={true} direction="vertical" />
    <Scene key="showVideo" component={ShowVideoContainer} hideNavBar={true} direction="vertical" />
  </Scene>
);

const getSceneStyle = (props, computedProps) => sceneStyle(props, computedProps).scene

const AppBuilder = store =>
  class App extends Component {
    static childContextTypes = {
      navigate: PropTypes.func,
      navigateBack: PropTypes.func,
    }

    getChildContext() {
      return {
        navigate: (...props) => store.dispatch(navigate(...props)),
        navigateBack: () => store.dispatch(navigateBack()),
      };
    }

    componentDidMount() {
      store.dispatch(appDidMount());
    }

    componentWillUnmount() {
      store.dispatch(appWillUnmount());
    }

    render() {
      return (
        <Provider store={store}>
          <Router
            createReducer={routeReducer(store)}
            scenes={scenes}
            getSceneStyle={getSceneStyle}
            title="Mudamos"
            backAndroidHandler={backAndroidHandler(store)}
          />
        </Provider>
      );
    }
  }

export default AppBuilder
