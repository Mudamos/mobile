import React, { Component } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { getTabView } from "../selectors";
import { connect } from "react-redux";
import { updateMainTabviewIndex } from "../actions";
import PropTypes from "prop-types";
import PlipsList from "../components/plips-list";

import styles from "../styles/main-tabview";

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

class MainTabview extends Component {
  static propTypes = {
    TabviewState: PropTypes.object,
    onUpdateIndex: PropTypes.func.isRequired,
  };

  _handleIndexChange = index => {
    const { onUpdateIndex } = this.props;

    onUpdateIndex({index});
  };
  _renderScene = ({ route }) => {
    switch (route.key) {
    case 'national':
      return <PlipsList {...this.props} />;
    case 'my_location':
      return <PlipsList {...this.props} />;
    case 'signed':
      return <PlipsList {...this.props} />;
    case 'favorites':
      return <PlipsList {...this.props} />;
    default:
      return null;
    }
  };

  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
      getLabelText={({ route }) => route.title}
    />
  );

  render() {
    const { TabviewState } = this.props;

    return (
      <TabView
        navigationState={TabviewState}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    TabviewState: getTabView(state),
  };
}

const mapDispatchToProps = dispatch => ({
  onUpdateIndex: ({ index }) => dispatch(updateMainTabviewIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainTabview);