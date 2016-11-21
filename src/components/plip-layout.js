import React, { Component, PropTypes }  from "react";

import {
  Text,
  View,
} from "react-native";

import ActionButton from 'react-native-action-button';
import Ionicon from 'react-native-vector-icons/Ionicons';

import moment from "moment";

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

  get daysLeft() {
    const { plip } = this.props;
    const start = moment(plip.cycle.initialDate);
    const end = moment(plip.cycle.finalDate);

    return end.diff(start, "days");
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
          { !errorFetchingPlips && !isFetching && this.renderMainContent() }
        </Layout>
      </View>
    );
  }

  renderMainContent() {
    const {
      plip
    } = this.props;

    return (
      <View style={{flex: 1}}>

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
          <View style={{ flex: 1 }}>
            <View style={{height: 50, backgroundColor: "#ccc", padding: 10}}>
              <View style={{flexDirection: "row"}}>
                { !!this.daysLeft && this.renderDaysLeft()}
                { !this.daysLeft && <Text>Petição finalizada</Text>}
              </View>
            </View>
            <MarkdownView content={plip.content} />
          </View>
        </ParallaxScrollView>

        <ActionButton buttonColor="rgba(231,76,60,1)" offsetX={10} offsetY={0.1}>
          <ActionButton.Item buttonColor="#1abc9c" title="Assinar" onPress={() => {}}>
            <Ionicon name="md-create"  style={{fontSize: 20, height: 22, color: "#fff"}}/>
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

  renderDaysLeft() {
    return (
      <View style={{flex: 1}}>
        <Text style={{fontStyle: "italic"}}>{this.daysLeft} dia(s) restante(s)</Text>
        <Text style={{fontStyle: "italic", fontSize: 10}}>para o fim da petição</Text>
      </View>
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
