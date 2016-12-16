import React, { Component, PropTypes }  from "react";

import {
  Text,
  View,
} from "react-native";

import { moment } from "../utils";

import ActionButton from "react-native-action-button";
import Ionicon from "react-native-vector-icons/Ionicons";

import ParallaxScrollView from "react-native-parallax-scroll-view";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import NetworkImage from "./network-image";
import PageLoader from "./page-loader";
import RetryButton from "./retry-button";
import style, { parallaxScrollView } from "../styles/plip-show";

import MarkdownView from "../containers/markdown-view";

class PlipLayout extends Component {
  state = {
    hasScroll: false,
  };

  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    navigationState: PropTypes.object.isRequired,
    plip: PropTypes.object,
    plipSignDate: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
  };

  get plipName() {
    const { plip } = this.props;
    if (!plip) return;

    return plip.cycle && plip.cycle.name;
  }

  get daysLeft() {
    const { plip } = this.props;
    if (!plip) return;

    const start = moment(plip.cycle.initialDate);
    const end = moment(plip.cycle.finalDate);

    return end.diff(start, "days");
  }

  render() {
    const {
      isFetchingPlip,
      errorFetchingPlips,
    } = this.props;

    return (
      <View style={style.container}>
        <PageLoader isVisible={isFetchingPlip} />

        <Layout>
          { isFetchingPlip && this.renderNavBar() }
          { errorFetchingPlips && this.renderRetry() }
          { !errorFetchingPlips && !isFetchingPlip && this.renderMainContent() }
        </Layout>
      </View>
    );
  }

  renderMainContent() {
    const {
      isSigning,
      plip,
      plipSignDate,
    } = this.props;

    const { stickyHeaderHeight, ...parallaxOptions } = parallaxScrollView;


    return (
      <View style={{flex: 1}}>
        <PageLoader isVisible={isSigning} />

        <ParallaxScrollView
          style={style.scrollView.style}
          bounces={false}
          {...parallaxOptions}
          stickyHeaderHeight={ this.state.hasScroll ? stickyHeaderHeight : 1 }
          backgroundSpeed={10}
          onScroll={this.onScroll.bind(this)}
          scrollEventThrottle={700}

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
            {
              !plipSignDate &&
                <View style={{flexDirection: "row"}}>
                  { !!this.daysLeft && this.renderDaysLeft()}
                  { !this.daysLeft && <Text>Petição finalizada</Text>}
                </View>
            }
            {
              plipSignDate &&
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                  <Text>Projeto Assinado</Text>
                  <Text>{plipSignDate.format("DD/MM/YYYY HH:mm:ss")}</Text>
                </View>
            }
            </View>
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
            { plip && <MarkdownView content={plip.content} /> }
            </View>
          </View>
        </ParallaxScrollView>

        {
          plip && !plipSignDate &&
          <ActionButton buttonColor="rgba(231,76,60,1)" offsetX={10} offsetY={0.1}>
            <ActionButton.Item buttonColor="#1abc9c" title="Assinar" onPress={this.onPlipSign.bind(this)}>
              <Ionicon name="md-create"  style={{fontSize: 20, height: 22, color: "#fff"}}/>
            </ActionButton.Item>
          </ActionButton>
        }
      </View>
    );
  }

  onPlipSign() {
    const { plip, onPlipSign } = this.props;
    onPlipSign(plip);
  }

  onScroll(event) {
    const hasScroll = event.nativeEvent.contentOffset.y > 0;
    const oldHasScroll = this.state.hasScroll;

    // Hack to allow click when we have a stick header
    if (hasScroll !== oldHasScroll) {
      this.setState({ hasScroll });
    }
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
      isUserLoggedIn,
      navigationState,
      onLogout,
    } = this.props;

    const leftView = isUserLoggedIn ? (
      <Text
        style={{color: "#fff"}}
        onPress={onLogout}
      >
        Logout
      </Text>
    ) : null;

    return (
      <NavigationBar
        leftView={leftView}
        title={navigationState.title}
      />
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
        {plip && plip.cycle && <NetworkImage source={{ uri: plip.cycle.pictures.original }} style={style.imageCall}/>}
      </View>
    );
  }
}

export default PlipLayout
