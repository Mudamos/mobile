import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import {
  moment,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
  findStateByUF,
} from "../utils";

import {
  isNationalCause,
} from "../models";

import Icon from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";
import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";
import TransparentFlatButton from "./transparent-flat-button";
import MetricsInfo from "../containers/plip/metrics-info";
import MainTabview from "../containers/main-tabview";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";
import {
  RemoteLinksType,
  SignatureGoalsType,
} from "../prop-types";

const plipRowReadingGradientColors = ["rgba(0, 0, 0, .3)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, .7)"];
const plipRowReadingGradientLocations = [0, 0.7, 1];

const hasSignedGradientColors = ["#00DB5E", "#00A79E"];

export default class PlipsLayout extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isFetchingPlipsNextPage: PropTypes.bool,
    isRefreshingPlips: PropTypes.bool,
    openMenu: PropTypes.func.isRequired,
    plips: PropTypes.array,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    signatureGoals: PropTypes.shape({
      [PropTypes.string]: SignatureGoalsType,
    }).isRequired,
    userSignInfo: PropTypes.object.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
  }

  render() {
    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          <MainTabview {...this.props}/>
        </Layout>
      </View>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={this.renderMenuButton()}
        middleView={this.renderLogo()}
        rightView={this.renderSearchButton()}
      />
    );
  }

  renderLogo() {
    return <HeaderLogo />
  }

  renderMenuButton() {
    return (
      <TouchableOpacity
        onPress={this.onOpenMenu}
      >
        <Icon
          name="dehaze"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

  renderSearchButton() {
    return (
      <TouchableOpacity
        onPress={this.onOpenMenu}
      >
        <Icon
          name="search"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

  onOpenMenu = () => {
    const { openMenu } = this.props;
    openMenu();
  }
}