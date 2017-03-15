import Config from "react-native-config";

import React, { Component, PropTypes } from "react";

import { Actions, Router, Scene } from "react-native-router-flux";
import sceneStyle from "./styles/scene-default";

import { isDev } from "./utils";

import {
  ChangeForgotPasswordContainer,
  ChangePasswordContainer,
  ForgotPasswordContainer,
  PlipContainer,
  PlipsContainer,
  PlipViewerContainer,
  ProfileAddressContainer,
  ProfileAddressConfirmContainer,
  ProfileAvatarContainer,
  ProfileBirthContainer,
  ProfileDocumentsContainer,
  ProfileMissingFieldsContainer,
  ProfilePhoneContainer,
  ProfilePhoneCodeContainer,
  ProfileUpdateContainer,
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
  fetchIsUserFirstTime,
  fetchSession,
  navigate,
  navigateBack,
} from "./actions";

import routeReducer from "./services/route-reducer";
import backAndroidHandler from "./back-android-handler";

import MudamosWebApi from "./services/mudamos-web";
import SessionManager from "./services/session";
import WalletManager from "./services/wallet";
import MobileApi from "./services/mobile-api";
import ApiError from "./services/api-error";
import { defaultStorage } from "./services/local-storage";
import DeviceInfo from "./services/device-info";
import PermissionService from "./services/permission";
import LocationService from "./services/location";
import Crypto from "./services/crypto";

import reducer from "./reducers";
import sagas from "./sagas";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createReduxLogger from "redux-logger";
import createSagaMiddleware from "redux-saga";

const sagaRunner = createSagaMiddleware();
const logger = createReduxLogger({
  collapsed: true,
  colors: {
    title: false,
    prevState: false,
    action: false,
    nextState: false,
    error: false,
  },
  diff: true,
  level: {
    prevState: false,
    action: "log",
    nextState: "log",
    error: "error",
  },
});

const store = isDev ?
  createStore(reducer, applyMiddleware(sagaRunner, logger)) :
  createStore(reducer, applyMiddleware(sagaRunner));

const sessionStore = SessionManager("@Mudamos");
const walletStore = WalletManager("@Mudamos");
const localStorage = defaultStorage();

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="plipsNav" initial={true} type="reset" hideNavBar={true}>
      <Scene key="plipsList" initial={true} component={PlipsContainer} hideNavBar={true} />
      <Scene key="showPlip" component={PlipContainer} hideNavBar={true} />
      <Scene key="plipViewer" component={PlipViewerContainer} hideNavBar={true} title="Texto do projeto"/>
      <Scene key="signers" component={SignersContainer} hideNavBar={true} />
    </Scene>

    <Scene key="signIn" component={SignInContainer} hideNavBar={true} />
    <Scene key="signUp" component={SignUpContainer} hideNavBar={true} title="Identificação" />

    <Scene key="forgotPassword" component={ForgotPasswordContainer} hideNavBar={true} />
    <Scene key="changeForgotPassword" component={ChangeForgotPasswordContainer} hideNavBar={true} />

    <Scene key="changePassword" component={ChangePasswordContainer} hideNavBar={true} />
    <Scene key="profileUpdate" component={ProfileUpdateContainer} hideNavBar={true} />

    <Scene key="profileMissingFields" component={ProfileMissingFieldsContainer} hideNavBar={true} title="Confirme suas informações" />
    <Scene key="profileAvatar" component={ProfileAvatarContainer} hideNavBar={true} />
    <Scene key="profileBirth" component={ProfileBirthContainer} hideNavBar={true} title="Data de Nascimento" />
    <Scene key="profileAddress" component={ProfileAddressContainer} hideNavBar={true} title="CEP" />
    <Scene key="profileAddressConfirm" component={ProfileAddressConfirmContainer} hideNavBar={true} title="CEP" />
    <Scene key="profileDocuments" component={ProfileDocumentsContainer} hideNavBar={true} title="Informe seus documentos" />
    <Scene key="profilePhone" component={ProfilePhoneContainer} hideNavBar={true} title="Telefone" />
    <Scene key="profilePhoneCode" component={ProfilePhoneCodeContainer} hideNavBar={true} title="Telefone" />
    <Scene key="profileWallet" component={ProfileWalletContainer} hideNavBar={true} duration={0} title="Wallet" />

    <Scene key="tse" component={TSEContainer} hideNavBar={true} direction="vertical" />
    <Scene key="showVideo" component={ShowVideoContainer} hideNavBar={true} direction="vertical" />
  </Scene>
);

sagaRunner.run(sagas, {
  apiError: ApiError(),
  Crypto,
  DeviceInfo,
  localStorage,
  locationService: LocationService,
  mudamosWebApi: MudamosWebApi(Config.MUDAMOS_WEB_API_URL),
  mobileApi: MobileApi(Config.MOBILE_API_URL),
  permissionService: PermissionService(),
  sessionStore,
  walletStore,
});

store.dispatch(fetchSession());
store.dispatch(fetchIsUserFirstTime());

const getSceneStyle = (props, computedProps) => sceneStyle(props, computedProps).scene

export default class App extends Component {
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
