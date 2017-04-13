import React, { Component, PropTypes } from "react";

import {
  Image,
  ListView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { moment, homeLinks } from "../utils";

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
import FlatButton from "./flat-button";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";

const LINKS_KEY = "LINKS";


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
    onGoToMudamos: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
  }

  get hasPlips() {
    const { plipsDataSource } = this.props;
    return plipsDataSource.getRowCount() > 0;
  }

  get hasNoListYet() {
    const { errorFetchingPlips, isFetchingPlips } = this.props;
    return errorFetchingPlips || isFetchingPlips || !this.hasPlips;
  }

  render() {
    const {
      errorFetchingPlips,
      isFetchingPlips,
    } = this.props;

    return (
      <View style={styles.full}>
        <Layout contentStyle={{backgroundColor: this.hasNoListYet ? "white" : "black"}}>
          {!errorFetchingPlips && this.hasPlips && this.renderListView()}
          {!errorFetchingPlips && !isFetchingPlips && !this.hasPlips && this.renderNoPlips()}
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

  renderRow = ({ height, margin }) => ([plip, index], section, row, highlightRow) => {
    const { onGoToPlip, plipsDataSource } = this.props;

    const shouldHideOverflow = index > 0 || plipsDataSource.getRowCount() === 1;

    const isLink = plip.key === LINKS_KEY;
    const TouchableView = isLink ? View : TouchableOpacity;

    return (
      <View style={styles.rowContainer}>
        <TouchableView
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
          {isLink && this.renderRowLinks()}
          {!isLink && this.renderRowPlip({ plip, index, height, margin })}
        </TouchableView>
      </View>
    );
  }

  renderRowLinks() {
    const { mudamos, projectsReason } = homeLinks;
    const { onOpenURL } = this.props;

    return (
      <LinearGradient
        start={[0.0, 0.1]}
        end={[0.5, 1.0]}
        locations={[0, 0.5]}
        style={styles.footerContainer}
        colors={["#9844ce", "#7E52D8"]}
      >
        <TouchableOpacity
          onPress={() => onOpenURL(mudamos.link) }
          style={styles.full}
        >
          {this.renderLink({ ...mudamos, icon: "extension" })}
        </TouchableOpacity>

        <View style={styles.hairline} />

        <TouchableOpacity
          onPress={() => onOpenURL(projectsReason.link) }
          style={styles.full}
        >
          {this.renderLink({ ...projectsReason, icon: "info" })}
        </TouchableOpacity>

      </LinearGradient>
    );
  }

  renderLink({ title, icon }) {
    return (
      <View style={styles.actionRow}>
        <Icon
          name={icon}
          size={40}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionTitle}>{title.toUpperCase()}</Text>
        <Icon
          name="chevron-right"
          size={40}
          color="#fff"
        />
      </View>
    );
  }

  renderRowPlip({ plip, index, height, margin }) {
    const totalHeight = height + margin;
    const scrollRange = totalHeight * (index - 1);

    // For some reason, Android crashes and a transform is applied
    // TODO: upgrade react-native and test again
    const ParallaxView = Platform.OS == "ios" ? Parallax : View;

    return (
      <View style={styles.full}>
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
      </View>
    );
  }


  renderNoPlips() {
    const { onGoToMudamos } = this.props;

    return (
      <View style={styles.noProjectsContainer}>
        <View style={styles.noProjectsInnerContainer}>
          <Image
            source={require("../images/plip-page.png")}
            style={styles.noProjectsIcon}
          />

          <View>
            <Text style={styles.noProjectsText}>{locale.noProjectsYet}</Text>
            <Text style={styles.noProjectsText}>{locale.followUpOnTheWeb}</Text>
            <TouchableOpacity onPress={onGoToMudamos}>
              <Text style={styles.link}>mudamos.org</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatButton
          title={locale.openSite.toUpperCase()}
          onPress={onGoToMudamos}
          style={{backgroundColor: "#00c084" }}
          textStyle={{color: "#fff"}}
        />
      </View>
    );
  }

  renderNavBar() {
    const navBarBackgroundColor = this.hasNoListYet ? "#303030" : "transparent";

    return (
      <View style={styles.navigationBarContainer}>
        { /* This is the top screen gradient, to give the smearing effect */ }
        {
          !this.hasNoListYet &&
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0)"]}
              style={styles.navigationBarGradient}
            />
        }

        <NavigationBar
          containerStyle={[styles.navigationBar, { backgroundColor: navBarBackgroundColor }]}
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
