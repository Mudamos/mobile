import React, { Component } from "react";
import { Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PropTypes from "prop-types";
import PlipsList from "../components/plips-list";
import { TabViewType } from "../prop-types";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
  label: {
    color: "#7705B9",
    fontSize: "1rem",
    fontFamily: "roboto",
  },
  tabBar: {
    backgroundColor: "#FFF",
  },
  tab: {
    width: 200,
  },
  indicator: {
    borderBottomColor: "#00BFD8",
    borderBottomWidth: 3,
  },
});


const initialLayout = {
  height: 0,
  width: Dimensions.get("window").width,
};

export default class MainTabView extends Component {
  static propTypes = {
    allPlips: PropTypes.array,
    allPlipsNextPage: PropTypes.number,
    errorFetchingAllPlips: PropTypes.bool,
    errorFetchingNationwidePlips: PropTypes.bool,
    errorFetchingSignedPlips: PropTypes.bool,
    errorFetchingUserFavoritePlips: PropTypes.bool,
    errorFetchingUserLocationPlips: PropTypes.bool,
    favoritePlips: PropTypes.array,
    favoritePlipsNextPage: PropTypes.number,
    isFetchingAllPlips: PropTypes.bool.isRequired,
    isFetchingFavoritePlips: PropTypes.bool.isRequired,
    isFetchingNationwidePlips: PropTypes.bool.isRequired,
    isFetchingPlipsByLocation: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageAllPlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageFavoritePlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageNationwidePlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPagePlipsByLocation: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageSignedPlips: PropTypes.bool.isRequired,
    isFetchingSignedPlips: PropTypes.bool.isRequired,
    isRefreshingAllPlips: PropTypes.bool.isRequired,
    isRefreshingFavoritePlips: PropTypes.bool.isRequired,
    isRefreshingNationwidePlips: PropTypes.bool.isRequired,
    isRefreshingPlipsByLocation: PropTypes.bool.isRequired,
    isRefreshingSignedPlips: PropTypes.bool.isRequired,
    loadedAllPlips: PropTypes.bool,
    loadedNationwidePlips: PropTypes.bool,
    loadedSignedPlips: PropTypes.bool,
    loadedUserFavoritePlips: PropTypes.bool,
    loadedUserLocationPlips: PropTypes.bool,
    nationwidePlips: PropTypes.array,
    nationwidePlipsNextPage: PropTypes.number,
    signedPlips: PropTypes.array,
    signedPlipsNextPage: PropTypes.number,
    tabViewState: TabViewType,
    userLocationPlips: PropTypes.array,
    userLocationPlipsNextPage: PropTypes.number,
    onMainTabChange: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
  };

  handleIndexChange = index => {
    const { onMainTabChange } = this.props;

    onMainTabChange({ index });
  };

  renderScene = ({ route }) => {
    const {
      nationwidePlips,
      userLocationPlips,
      allPlips,
      favoritePlips,
      signedPlips,
      nationwidePlipsNextPage,
      userLocationPlipsNextPage,
      favoritePlipsNextPage,
      allPlipsNextPage,
      signedPlipsNextPage,
      loadedAllPlips,
      loadedNationwidePlips,
      loadedSignedPlips,
      loadedUserFavoritePlips,
      loadedUserLocationPlips,
      errorFetchingAllPlips,
      errorFetchingNationwidePlips,
      errorFetchingSignedPlips,
      errorFetchingUserFavoritePlips,
      errorFetchingUserLocationPlips,
      isFetchingAllPlips,
      isFetchingFavoritePlips,
      isFetchingNationwidePlips,
      isFetchingPlipsByLocation,
      isFetchingSignedPlips,
      isFetchingPlipsNextPageAllPlips,
      isFetchingPlipsNextPageFavoritePlips,
      isFetchingPlipsNextPageNationwidePlips,
      isFetchingPlipsNextPagePlipsByLocation,
      isFetchingPlipsNextPageSignedPlips,
      isRefreshingAllPlips,
      isRefreshingFavoritePlips,
      isRefreshingNationwidePlips,
      isRefreshingPlipsByLocation,
      isRefreshingSignedPlips,
    } = this.props;

    switch (route.key) {
    case "nationwidePlips":
      return <PlipsList
        {...this.props}
        typeList={route.key}
        plips={nationwidePlips}
        nextPage={nationwidePlipsNextPage}
        hasLoadedPlips={loadedNationwidePlips}
        isFetchingPlips={isFetchingNationwidePlips}
        isFetchingPlipsNextPage={isFetchingPlipsNextPageNationwidePlips}
        isRefreshingPlips={isRefreshingNationwidePlips}
        fetchingError={errorFetchingNationwidePlips}/>;
    case "userLocationPlips":
      return <PlipsList
        {...this.props}
        typeList={route.key}
        plips={userLocationPlips}
        nextPage={userLocationPlipsNextPage}
        hasLoadedPlips={loadedUserLocationPlips}
        isFetchingPlips={isFetchingPlipsByLocation}
        isFetchingPlipsNextPage={isFetchingPlipsNextPagePlipsByLocation}
        isRefreshingPlips={isRefreshingPlipsByLocation}
        fetchingError={errorFetchingUserLocationPlips}/>;
    case "allPlips":
      return <PlipsList
        {...this.props}
        typeList={route.key}
        plips={allPlips}
        nextPage={allPlipsNextPage}
        hasLoadedPlips={loadedAllPlips}
        isFetchingPlips={isFetchingAllPlips}
        isFetchingPlipsNextPage={isFetchingPlipsNextPageAllPlips}
        isRefreshingPlips={isRefreshingAllPlips}
        fetchingError={errorFetchingAllPlips}/>;
    case "signedPlips":
      return <PlipsList
        {...this.props}
        typeList={route.key}
        plips={signedPlips}
        nextPage={signedPlipsNextPage}
        hasLoadedPlips={loadedSignedPlips}
        isFetchingPlips={isFetchingSignedPlips}
        isFetchingPlipsNextPage={isFetchingPlipsNextPageSignedPlips}
        isRefreshingPlips={isRefreshingSignedPlips}
        fetchingError={errorFetchingSignedPlips}/>;
    case "favoritePlips":
      return <PlipsList
        {...this.props}
        typeList={route.key}
        plips={favoritePlips}
        nextPage={favoritePlipsNextPage}
        hasLoadedPlips={loadedUserFavoritePlips}
        isFetchingPlips={isFetchingFavoritePlips}
        isFetchingPlipsNextPage={isFetchingPlipsNextPageFavoritePlips}
        isRefreshingPlips={isRefreshingFavoritePlips}
        fetchingError={errorFetchingUserFavoritePlips}/>;
    default:
      return null;
    }
  };

  routeTitle = ({ route }) => route.title;

  renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
      getLabelText={this.routeTitle}
    />
  );

  render() {
    const { tabViewState } = this.props;

    return (
      <TabView
        navigationState={tabViewState}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}