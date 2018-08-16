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
    } = this.props;

    switch (route.key) {
    case "national":
      return <PlipsList {...this.props} plips={nationwidePlips}/>;
    case "myLocation":
      return <PlipsList {...this.props} plips={userLocationPlips}/>;
    case "all":
      return <PlipsList {...this.props} plips={allPlips}/>;
    case "signed":
      return <PlipsList {...this.props} plips={signedPlips}/>;
    case "favorites":
      return <PlipsList {...this.props} plips={favoritePlips}/>;
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