import React, { Component, PropTypes }  from "react";

import {
  Text,
  View,
} from "react-native";

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import RetryButton from "./retry-button";
import style, { parallaxScrollView } from "../styles/plip-show";

import Spinner from "react-native-spinkit";

import MarkdownView from "../containers/markdown-view";

class PlipLayout  extends Component {
  static propTypes = {
    plip: PropTypes.object.isRequired,
    retryPlip: PropTypes.func.isRequired,
    isFetchingPlips: PropTypes.bool,
    errorFetchingPlips: PropTypes.object
  };

  static defaultProps = {
    plip: {}
  };

  get plipName() {
    const { plip } = this.props;
    return plip.cycle && plip.cycle.name;
  }

  render() {
    const {
      isFetching,
      errorFetchingPlips,
    } = this.props;

    return (
      <View style={style.container}>
        <PageLoader isVisible={isFetching} />

        <Layout>
          { isFetching && this.renderNavBar() }
          { errorFetchingPlips && this.renderRetry() }
          { !errorFetchingPlips && !isFetching && this.renderScrollView() }
        </Layout>
      </View>
    );
  }

  renderScrollView() {
    const {
      plip
    } = this.props;

    return (
      <ParallaxScrollView
        style={style.scrollView.style}
        bounces={false}
        {...parallaxScrollView}
        backgroundSpeed={10}

        renderBackground={this.renderBackground.bind(this)}

        renderForeground={() => (
          <View style={{flex: 1}}>
            {this.renderNavBar()}
            <View style={style.foreGroundContainer}>
              <View style={style.mainTitleContainer}>
                <Text style={style.mainCycleTitle}>
                  {this.plipName}
                </Text>
              </View>
            </View>
          </View>
        )}
        renderStickyHeader={() => (
          <View style={style.stickyHeader}>
            <Text style={style.navCycleTitle} numberOfLines={1}>{this.plipName}</Text>
          </View>
        )}
        >
        <View style={{ flex: 1, marginTop: 20 }}>
          <MarkdownView content={plip.content} />
        </View>
      </ParallaxScrollView>
    );
  }

  renderNavBar() {
    const {
      navigationState
    } = this.props;

    return (
      <NavigationBar title={navigationState.title} />
    );
  }

  renderRetry() {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        {this.renderNavBar()}
        <RetryButton onPress={this.props.retryPlip} />
      </View>
    );
  }

  renderBackground() {
    const { plip } = this.props;

    return (
      <View style={style.backgroundContainer}>
        {plip.cycle && <NetworkImage source={{ uri: plip.cycle.pictures.original }} style={style.imageCall}/>}
      </View>
    );
  }
}

export default PlipLayout
