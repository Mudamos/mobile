import React, { Component } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { getMainTabView } from "../selectors";
import { connect } from "react-redux";
import { updateMainTabViewIndex } from "../actions";
import PropTypes from "prop-types";
import PlipsList from "../components/plips-list";
import { TabViewType } from "../prop-types";

const styles = StyleSheet.create({
  label: {
    color: '#7705B9',
    fontSize: 18,
    fontFamily: "roboto",
  },
  tabBar: {
    backgroundColor: '#FFF',
  },
  tab: {
    width: 180,
  },
  indicator: {
    borderBottomColor: '#00BFD8',
    borderBottomWidth: 3,
  },
});


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class MainTabView extends Component {
  static propTypes = {
    tabViewState: TabViewType,
    onUpdateIndex: PropTypes.func.isRequired,
  };

  handleIndexChange = index => {
    const { onUpdateIndex } = this.props;

    onUpdateIndex({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
    case 'national':
      return <PlipsList {...this.props} />;
    case 'myLocation':
      return <PlipsList {...this.props} />;
    case 'signed':
      return <PlipsList {...this.props} />;
    case 'favorites':
      return <PlipsList {...this.props} />;
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