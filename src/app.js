import "react-native-gesture-handler";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import OneSignal from "react-native-onesignal";

import EStyleSheet from "react-native-extended-stylesheet";

import { Dimensions } from "react-native";

import {
  AboutAppContainer,
  CantSignPlipContainer,
  ChangeForgotPasswordContainer,
  ConfirmVoteContainer,
  ConfirmVoteCodeContainer,
  ForgotPasswordContainer,
  HelpContainer,
  IntroContainer,
  MessageSignerContainer,
  MessageSignerSuccessContainer,
  PlipContainer,
  PlipsContainer,
  PlipViewerContainer,
  PrivacyPolicyContainer,
  ProfileAddressContainer,
  ProfileConcludeContainer,
  ProfileUpdateContainer,
  ProfileSignUpContainer,
  ProfileVoteAddressContainer,
  ProfileWalletContainer,
  ScannerContainer,
  SendYourPLContainer,
  ShowVideoContainer,
  SignersContainer,
  SignInContainer,
  SignUpContainer,
  TSEContainer,
} from "./containers";

import { PermissionProvider } from "./providers/permisson-provider";

import { appDidMount, appWillUnmount, navigate, navigateBack } from "./actions";

import { SCREEN_KEYS } from "./models";

import routeReducer from "./services/route-reducer";
import backAndroidHandler from "./back-android-handler";

import { Provider } from "react-redux";

OneSignal.inFocusDisplaying(2); // Show notification on drawer

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="plipsNav" type="reset" hideNavBar={true}>
      <Scene key="plipsList" component={PlipsContainer} hideNavBar={true} />
    </Scene>

    <Scene
      key="intro"
      initial={true}
      component={IntroContainer}
      hideNavBar={true}
    />

    <Scene key="showPlip" component={PlipContainer} hideNavBar={true} />
    <Scene
      key="plipViewer"
      component={PlipViewerContainer}
      hideNavBar={true}
      title="Texto do projeto"
    />
    <Scene key="signers" component={SignersContainer} hideNavBar={true} />

    <Scene
      key="cantSignPlip"
      component={CantSignPlipContainer}
      hideNavBar={true}
    />

    <Scene key="signIn" component={SignInContainer} hideNavBar={true} />

    <Scene
      key="signUp"
      component={SignUpContainer}
      hideNavBar={true}
      title="Identificação"
    />
    <Scene
      key="profileSignUp"
      component={ProfileSignUpContainer}
      hideNavBar={true}
      title="Dados Pessoais"
    />
    <Scene
      key="profileVoteAddress"
      component={ProfileVoteAddressContainer}
      hideNavBar={true}
      title="Confirme local de votação"
    />
    <Scene
      key="profileAddress"
      component={ProfileAddressContainer}
      hideNavBar={true}
      title="CEP"
    />
    <Scene
      key="profileWallet"
      component={ProfileWalletContainer}
      hideNavBar={true}
      duration={0}
      title="Wallet"
    />
    <Scene
      key="profileConclude"
      component={ProfileConcludeContainer}
      hideNavBar={true}
      title="Conclude"
    />

    <Scene
      key="forgotPassword"
      component={ForgotPasswordContainer}
      hideNavBar={true}
    />
    <Scene
      key="changeForgotPassword"
      component={ChangeForgotPasswordContainer}
      hideNavBar={true}
    />

    <Scene
      key="profileUpdate"
      component={ProfileUpdateContainer}
      hideNavBar={true}
    />

    <Scene key="aboutApp" component={AboutAppContainer} hideNavBar={true} />
    <Scene key="help" component={HelpContainer} hideNavBar={true} />
    <Scene key="sendYourPl" component={SendYourPLContainer} hideNavBar={true} />

    <Scene key="tse" component={TSEContainer} hideNavBar={true} />
    <Scene
      key="showVideo"
      component={ShowVideoContainer}
      hideNavBar={true}
      direction="vertical"
    />

    <Scene
      key={SCREEN_KEYS.CONFIRM_VOTE}
      component={ConfirmVoteContainer}
      hideNavBar
    />
    <Scene
      key={SCREEN_KEYS.CONFIRM_VOTE_CODE}
      component={ConfirmVoteCodeContainer}
      hideNavBar
    />

    <Scene
      key={SCREEN_KEYS.PRIVACY_POLICY}
      component={PrivacyPolicyContainer}
      hideNavBar
    />

    <Scene
      key={SCREEN_KEYS.MESSAGE_SIGN}
      component={MessageSignerContainer}
      duration={0}
      hideNavBar
    />

    <Scene
      key={SCREEN_KEYS.MESSAGE_SIGN_SUCCESS}
      component={MessageSignerSuccessContainer}
      type="replace"
      direction="vertical"
      hideNavBar
    />

    <Scene key={SCREEN_KEYS.SCANNER} component={ScannerContainer} hideNavBar />
  </Scene>,
);

const entireScreenWidth = Dimensions.get("window").width;

EStyleSheet.build({
  $rem: entireScreenWidth > 360 ? 20 : 16,
});

const getSceneStyle = (props, computedProps) =>
  sceneStyle(props, computedProps).scene;

const AppBuilder = (store) => {
  const reducer = routeReducer(store);
  const backHandler = backAndroidHandler(store);

  return class App extends Component {
    static childContextTypes = {
      navigate: PropTypes.func,
      navigateBack: PropTypes.func,
    };

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
          <PermissionProvider>
            <Router
              createReducer={reducer}
              scenes={scenes}
              getSceneStyle={getSceneStyle}
              title="Mudamos"
              backAndroidHandler={backHandler}
            />
          </PermissionProvider>
        </Provider>
      );
    }
  };
};

export default AppBuilder;
