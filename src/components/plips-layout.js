import React, { Component, PropTypes } from "react";

import {
  ListView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { moment } from "../utils";

import Icon from "react-native-vector-icons/MaterialIcons";

import {
  FadeOut,
  Parallax,
  ScrollDriver,
} from "@shoutem/animation";

import Layout from "./layout";
import PageLoader from "./page-loader";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";
import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";


export default class PlipsLayout extends Component {
  driver = new ScrollDriver();

  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    nextPage: PropTypes.number,
    openMenu: PropTypes.func.isRequired,
    plipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    onFetchPlips: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
  }

  render() {
    const {
      errorFetchingPlips,
      isFetchingPlips,
    } = this.props;

    return (
      <View style={styles.full}>
        <Layout contentStyle={styles.layoutContent}>
          {!errorFetchingPlips && this.renderListView()}
          {errorFetchingPlips && this.renderRetry()}
          {this.renderNavBar()}
        </Layout>

        <PageLoader isVisible={isFetchingPlips} />
      </View>
    );
  }

  renderListView() {
    const {
      plipsDataSource,
      isRefreshing,
      onFetchPlips,
      onRefresh,
    } = this.props;

    return (
      <ListView
        {...this.driver.scrollViewProps}

        style={styles.listView}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        onEndReached={onFetchPlips}
        onEndReachedThreshold={300}
        dataSource={plipsDataSource}
        renderHeader={this.renderHeader.bind(this)}
        renderRow={this.renderRow({ height: 333, margin: 0 })}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
      />
    );
  }

  renderHeader() {
    const { plipsDataSource } = this.props;
    if (plipsDataSource.getRowCount() > 0) return null;

    return (
      <View style={styles.noProjectsHeader}>
        <Text style={styles.noProjects}>{locale.noProjectsFound}</Text>
        <Text style={styles.noProjects}>{locale.pullToRefresh}</Text>
      </View>
    );
  }

  renderRow = ({ height, margin }) => ([plip, index], section, row, highlightRow) => {
    const { onGoToPlip, plipsDataSource } = this.props;

    const totalHeight = height + margin;
    const scrollRange = totalHeight * (index - 1);

    const shouldHideOverflow = index > 0 || plipsDataSource.getRowCount() === 1;

    // For some reason, Android crashes and a transform is applied
    // TODO: upgrade react-native and test again
    const ParallaxView = Platform.OS == "ios" ? Parallax : View;

    return (
      <View style={{backgroundColor: "black"}}>
        <TouchableOpacity
          onPress={() => {
            highlightRow(section, row);
            onGoToPlip(plip);
          }}
          style={[styles.tableRow, {
            // We don't want to overflow the first row, so we can see the image
            // on ios during the bounce animation
            overflow: shouldHideOverflow ? "hidden" : "visible",

            height,
            margin,
          }]}
        >
          <ParallaxView
            driver={this.driver}
            scrollSpeed={0.7}
            style={{alignItems: "center", justifyContent: "center"}}
            header={index == 0 /* If this is not informed, Shouten will use the incorrect initial transform */}
            extrapolation={{
              // We must "divide" the scroll range into each PLIP,
              // otherwise the accumulated error will cause layout break on long lists
              inputRange: [scrollRange, scrollRange + totalHeight],
            }}
          >
            <NetworkImage
              source={{uri: this.plipImage(plip)}}
              resizeMode="cover"
              style={styles.plipImage}
            />
          </ParallaxView>

          { /* This gradient improves the reading of the PLIP title and subtitle */ }
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 1)"]}
            locations={[0.5, 0.9, 1]}
            style={styles.plipImageGradient}
          />

          <View style={styles.plipTitleContainer}>
            <View style={styles.plipTitleInnerContainer}>
              <Text style={styles.plipTitle} numberOfLines={3}>
                {plip.phase.name}
              </Text>

              <Text style={styles.plipSubtitle} numberOfLines={3}>
                {plip.phase.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderNavBar() {
    return (
      <View style={styles.navigationBarContainer}>
        { /* This is the top screen gradient, to give the smearing effect */ }
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0)"]}
          style={styles.navigationBarGradient}
        />

        <NavigationBar
          containerStyle={styles.navigationBar}
          leftView={this.renderMenuButton()}
          middleView={this.renderLogo()}
        />
      </View>
    );
  }

  renderLogo() {
    return (
      <FadeOut inputRange={[0, 100]} driver={this.driver}>
        <HeaderLogo />
      </FadeOut>
    );
  }

  renderMenuButton() {
    const { openMenu } = this.props;

    return (
      <FadeOut inputRange={[0, 100]} driver={this.driver}>
        <TouchableOpacity
          onPress={openMenu}
        >
          <Icon
            name="dehaze"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </FadeOut>
    );
  }

  renderRetry() {
    const { onRetryPlips } = this.props;

    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={onRetryPlips}
          style={{marginHorizontal: 20, backgroundColor: "#ddd"}}
        />
      </View>
    );
  }

  formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  plipImage(plip) {
    return plip.cycle && plip.cycle.pictures && plip.cycle.pictures.original;
  }
}