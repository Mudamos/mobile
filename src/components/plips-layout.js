import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  TouchableOpacity,
  View,
} from "react-native";

import {
  TabViewType,
} from "../prop-types";

import Icon from "react-native-vector-icons/MaterialIcons";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import HeaderLogo from "./header-logo";
import MainTabView from "../components/main-tab-view";

import styles from "../styles/plips-layout";

import {
  RemoteLinksType,
} from "../prop-types";

export default class PlipsLayout extends Component {
  static propTypes = {
    allPlips: PropTypes.array,
    allPlipsNextPage: PropTypes.number,
    currentUser: PropTypes.object,
    favoritePlips: PropTypes.array,
    favoritePlipsNextPage: PropTypes.number,
    isRefreshingPlips: PropTypes.bool,
    loadedAllPlips: PropTypes.bool,
    loadedNationwidePlips: PropTypes.bool,
    loadedSignedPlips: PropTypes.bool,
    loadedUserFavoritePlips: PropTypes.bool,
    loadedUserLocationPlips: PropTypes.bool,
    nationwidePlips: PropTypes.array,
    nationwidePlipsNextPage: PropTypes.number,
    openMenu: PropTypes.func.isRequired,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    signedPlips: PropTypes.array,
    signedPlipsNextPage: PropTypes.number,
    tabViewState: TabViewType,
    userLocationPlips: PropTypes.array,
    userLocationPlipsNextPage: PropTypes.number,
    userSignInfo: PropTypes.object.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onMainTabChange: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
  }

  render() {
    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}
          <MainTabView {...this.props}/>
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

  // TODO: Add search filter
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