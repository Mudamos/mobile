import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import PropTypes from "prop-types";
import PlipsList from "../components/plips-list";
import { TabViewType } from "../prop-types";

const styles = StyleSheet.create({
  label: {
    color: "#7705B9",
    fontSize: 18,
    fontFamily: "roboto",
  },
  tabBar: {
    backgroundColor: "#FFF",
  },
  tab: {
    width: 180,
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
    tabViewState: TabViewType,
    nationwidePlips: PropTypes.array,
    userLocationPlips: PropTypes.array,
    allPlips: PropTypes.array,
    favoritePlips: PropTypes.array,
    signedPlips: PropTypes.array,
    onMainTabChange: PropTypes.func.isRequired,
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
    } = this.props;

    switch (route.key) {
    case "nationwidePlips":
      return <PlipsList {...this.props} typeList={route.key} plips={nationwidePlips} nextPage={nationwidePlipsNextPage}/>;
    case "userLocationPlips":
      return <PlipsList {...this.props} typeList={route.key} plips={userLocationPlips} nextPage={userLocationPlipsNextPage}/>;
    case "allPlips":
      return <PlipsList {...this.props} typeList={route.key} plips={allPlips} nextPage={allPlipsNextPage}/>;
    case "signedPlips":
      return <PlipsList {...this.props} typeList={route.key} plips={signedPlips} nextPage={signedPlipsNextPage}/>;
    case "favoritePlips":
      return <PlipsList {...this.props} typeList={route.key} plips={favoritePlips} nextPage={favoritePlipsNextPage}/>;
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