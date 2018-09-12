import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  SafeAreaView,
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

import SearchModal from "./search-modal";

import { getMainTabViewIndexByKey } from "./../models/main-tab-view";

import {
  RemoteLinksType,
} from "../prop-types";

export default class PlipsLayout extends Component {
  static propTypes = {
    allPlips: PropTypes.array,
    allPlipsNextPage: PropTypes.number,
    currentMainTabViewTab: PropTypes.string,
    currentUser: PropTypes.object,
    favoritePlips: PropTypes.array,
    favoritePlipsNextPage: PropTypes.number,
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
    searchTitle: PropTypes.string,
    signedPlips: PropTypes.array,
    signedPlipsNextPage: PropTypes.number,
    tabViewState: TabViewType,
    userLocationPlips: PropTypes.array,
    userLocationPlipsNextPage: PropTypes.number,
    userSignInfo: PropTypes.object.isRequired,
    onClearSearch: PropTypes.func.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onMainTabChange: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onSearchPlip: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
  }

  state = {
    isSearchModalVisible: false,
  };

  goToAllPlips = () => {
    const { onMainTabChange } = this.props;

    const index = getMainTabViewIndexByKey("allPlips")
    onMainTabChange({ index });
  };

  onToggleSearchModal = () => {
    const { currentMainTabViewTab } = this.props;
    const { isSearchModalVisible } = this.state;

    if (!isSearchModalVisible && currentMainTabViewTab !== "allPlips") {
      this.goToAllPlips();
    }

    this.setState(({ isSearchModalVisible }) => ({ isSearchModalVisible: !isSearchModalVisible }));
  };

  onClearSearch = () => {
    const { onClearSearch } = this.props;

    this.onToggleSearchModal();
    onClearSearch();
  }

  render() {
    return (
      <SafeAreaView style={styles.full}>
        <Layout>
          { this.renderNavBar() }
          <MainTabView {...this.props}/>
          { this.renderSearchModal() }
        </Layout>
      </SafeAreaView>
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

  renderSearchModal() {
    const { isSearchModalVisible } = this.state;
    const { searchTitle, onSearchPlip } = this.props;

    return (
      <SearchModal
        isVisible={isSearchModalVisible}
        onToggleModal={this.onToggleSearchModal}
        onSearch={onSearchPlip}
        onClearSearch={this.onClearSearch}
        searchTitle={searchTitle} />
    );
  }

  renderSearchButton() {
    return (
      <TouchableOpacity
        onPress={this.onToggleSearchModal}
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