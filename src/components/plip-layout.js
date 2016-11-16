import React, { Component, PropTypes }  from "react";

import {
  ActivityIndicator,
  Button,
  Image,
  Text,
  View
} from "react-native";

import ParallaxScrollView from 'react-native-parallax-scroll-view';

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import style, { parallaxScrollView } from "../styles/plip-show";

import Spinner from "react-native-spinkit";
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

  render() {
    const {
      plip,
      retryPlip,
      isFetching,
      errorFetchingPlips,
      navigationState
    } = this.props;

    return (
      <View style={style.container}>
        <PageLoader isVisible={isFetching} />

        <Layout>
          <ParallaxScrollView
            style={style.scrollView.style}
            bounces={false}
            {...parallaxScrollView}
            backgroundSpeed={10}

            renderBackground={() => (
              <View style={{flex: 1}}>
                { plip.cycle && <NetworkImage source={{ uri: plip.cycle.pictures.original }} style={style.imageCall}/> }
              </View>
            )}
            renderForeground={() => (
              <View style={{flex: 1}}>
                <NavigationBar title={navigationState.title} />

                <View style={style.foreGroundContainer}>
                  <View style={style.mainTitleContainer}>
                    <Text style={style.mainCycleTitle}>
                      {this.plipName()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            renderStickyHeader={() => (
              <View style={style.stickyHeader}>
                <Text style={style.navCycleTitle} numberOfLines={1}>{this.plipName()}</Text>
              </View>
            )}
            >
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 30 }}>{JSON.stringify(this.props)}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              <Text style={{ fontSize: 30 }}>{plip.content}</Text>
              { errorFetchingPlips && this.renderError() }
            </View>
          </ParallaxScrollView>
        </Layout>
      </View>
    );
  }

  renderError() {
    return (
      <View>
        <Text>error</Text>
        <Button onPress={() => this.props.retryPlip() } title="Retry" />
      </View>
    );
  }

  plipName() {
    const { plip } = this.props;
    return plip.cycle && plip.cycle.name;
  }
}

export default PlipLayout
