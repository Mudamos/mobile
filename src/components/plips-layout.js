import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  ActivityIndicator,
  Image,
  ListView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import {
  moment,
  NATIONWIDE_SCOPE,
  STATEWIDE_SCOPE,
  CITYWIDE_SCOPE,
  findStateByUF,
} from "../utils";

import {
  isNationalCause,
} from "../models";

import Icon from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";

import Layout from "./layout";
import NavigationBar from "./navigation-bar";
import RetryButton from "./retry-button";
import HeaderLogo from "./header-logo";
import NetworkImage from "./network-image";
import LinearGradient from "react-native-linear-gradient";
import FlatButton from "./flat-button";
import TransparentFlatButton from "./transparent-flat-button";
import MyListView from "./list-view";
import MetricsInfo from "../containers/plip/metrics-info";

import styles from "../styles/plips-layout";

import locale from "../locales/pt-BR";
import {
  RemoteLinksType,
  SignatureGoalsType,
} from "../prop-types";

const plipRowReadingGradientColors = ["rgba(0, 0, 0, .3)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, .7)"];
const plipRowReadingGradientLocations = [0, 0.7, 1];

const hasSignedGradientColors = ["#00DB5E", "#00A79E"];

export default class PlipsLayout extends Component {
  state = {
    isRemainingDaysEnabled: PropTypes.bool,
  };

  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isRefreshingPlips: PropTypes.bool,
    openMenu: PropTypes.func.isRequired,
    plipsDataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    signatureGoals: PropTypes.shape({
      [PropTypes.string]: SignatureGoalsType,
    }).isRequired,
    userSignInfo: PropTypes.object.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
  }

  plipSignatureGoals(plipId) {
    const { signatureGoals } = this.props;
    return signatureGoals[plipId];
  }

  render() {
    return (
      <View style={styles.full}>
        <Layout>
          {this.renderNavBar()}

          {this.renderContent()}
        </Layout>
      </View>
    );
  }

  renderContent() {
    const {
      errorFetchingPlips: error,
      isFetchingPlips,
      isRefreshingPlips,
      plipsDataSource,
    } = this.props;

    const hasRows = plipsDataSource.getRowCount() > 0;
    const shouldShowNoPlips =
      !error &&
      !isFetchingPlips &&
      !hasRows;

    return (
      <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
        {
          !error && hasRows &&
            this.renderListView({
              plipsDataSource,
              isRefreshingPlips,
            })
        }

        {!!shouldShowNoPlips && this.renderNoPlips()}
        {error && this.renderRetry()}
        {isFetchingPlips && this.renderInnerLoader({ animating: isFetchingPlips })}
      </View>
    );
  }

  renderInnerLoader({ animating }) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator
          animating={animating}
          color="black"
          size="large"
        />
      </View>
    );
  }

  renderListView({ plipsDataSource, isRefreshingPlips }) {
    return (
      <MyListView
        style={styles.listView}
        contentContainerStyle={styles.listViewContent}
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        scrollEventThrottle={500}
        dataSource={plipsDataSource}
        renderRow={this.renderCommonRow}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingPlips}
            onRefresh={this.onRefresh}
            tintColor="black"
          />
        }
      />
    );
  }

  renderRow = ({ height, margin }) => ([plip, index], section, row, highlightRow) => {
    const { onGoToPlip } = this.props;

    return (
      <View style={[styles.rowContainer, index === 0 ? styles.firstRowContainer : {}]}>
        <TouchableOpacity
          onPress={() => {
            highlightRow(section, row);
            onGoToPlip(plip);
          }}
          style={[styles.tableRow, {
            minHeight: height,
            margin,
          }]}
        >
          {this.renderRowPlip({ plip, height, margin })}
        </TouchableOpacity>
      </View>
    );
  }

  renderCommonRow = this.renderRow({ height: 360, margin: 0 });

  renderRowPlip({ plip }) {
    const {
      currentUser,
      plipsSignInfo,
      userSignInfo,
      onGoToPlip,
    } = this.props;
    const plipSignInfo = plipsSignInfo[plip.id];
    const plipUserSignInfo = userSignInfo[plip.id];
    const hasSigned = !!(plipUserSignInfo && plipUserSignInfo.updatedAt);
    const goals = this.plipSignatureGoals(plip.id);

    // Not every animation seem to work on both platforms
    const AnimatableView = Platform.OS === "ios" ? Animatable.View : View;

    return (
      <View style={styles.plipRow}>
        <NetworkImage
          source={{uri: this.plipImage(plip)}}
          resizeMode="cover"
          style={styles.plipImage}
        />

        { /* This gradient improves the reading of the PLIP title and subtitle */ }
        <LinearGradient
          colors={plipRowReadingGradientColors}
          locations={plipRowReadingGradientLocations}
          style={styles.plipImageGradient}
        />

        <View style={styles.plipTitleContainer}>
          <View style={styles.plipTitleInnerContainer}>
            <Text style={styles.plipTitle}>
              {plip.phase.name}
            </Text>

            <Text style={styles.plipSubtitle}>
              {plip.phase.description}
            </Text>

            <Text style={styles.plipScope}>
              {this.scopeCoverageTitle(plip)}
            </Text>
          </View>

          <TransparentFlatButton
            title={locale.moreDetails.toUpperCase()}
            onPress={() => onGoToPlip(plip)}
            style={{
              height: 35,
              marginHorizontal: 20,
              marginTop: 55,
              marginBottom: 25,
            }}
            textStyle={{
              textShadowColor: "rgba(0,0,0, 1)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          />

          {
            !!plipSignInfo &&
              <Animatable.View animation="fadeInUp" easing="ease">
                <MetricsInfo
                  signaturesRequired={goals.currentSignatureGoal}
                  signaturesCount={plipSignInfo.signaturesCount}
                  totalSignaturesRequired={goals.finalGoal}
                  finalDate={plip.phase.finalDate}
                  plip={plip}
                  user={currentUser}
                />
              </Animatable.View>
          }

          {
            hasSigned &&
              <AnimatableView animation="zoomIn" easing="ease-in-out-sine" style={styles.signedContainer} duration={2000}>
                <LinearGradient
                  colors={hasSignedGradientColors}
                  style={styles.signedGradient}
                >
                  <Text style={styles.signedText}>{locale.signed}</Text>
                </LinearGradient>
              </AnimatableView>
          }

          <Image source={require("../images/plips-top-left.png")} style={{position: "absolute", top: 0, left: 0}} />
          <Image source={require("../images/plips-bottom-right.png")} style={{position: "absolute", bottom: 0, right: 0}} />
          <Image source={require("../images/plips-bottom-left.png")} style={{position: "absolute", bottom: 0, left: 0}} />
          <Image source={require("../images/plips-top-right.png")} style={{position: "absolute", top: 0, right: 0}} />
        </View>

      </View>
    );
  }

  scopeCoverageTitle(plip) {
    if (plip.scopeCoverage.scope === NATIONWIDE_SCOPE) {
      return "PL Nacional";
    } else if (isNationalCause(plip)) {
      return "Causa Nacional";
    } else if (plip.scopeCoverage.scope === STATEWIDE_SCOPE) {
      return `PL Estadual: ${findStateByUF(plip.scopeCoverage.uf).name}`;
    } else if (plip.scopeCoverage.scope === CITYWIDE_SCOPE) {
      return `PL Municipal: ${plip.scopeCoverage.city.name}, ${plip.scopeCoverage.city.uf}`;
    }
  }

  renderNoPlips() {
    return (
      <View style={styles.noProjectsContainer}>
        <View style={styles.noProjectsInnerContainer}>
          <Image
            source={require("../images/plip-page.png")}
            style={styles.noProjectsIcon}
          />

          <Text style={styles.noProjectsText}>{locale.noProjectsYet}</Text>
        </View>

        <FlatButton
          title={locale.links.sendYourIdea.toUpperCase()}
          onPress={this.onSendYourIdea}
          style={{backgroundColor: "#00c084" }}
          textStyle={{color: "#fff"}}
        />
      </View>
    );
  }

  renderNavBar() {
    return (
      <NavigationBar
        containerStyle={styles.navigationBar}
        leftView={this.renderMenuButton()}
        middleView={this.renderLogo()}
      />
    );
  }

  renderLogo() {
    return <HeaderLogo />
  }

  renderMenuButton() {
    return (
      <TouchableOpacity
        onPress={this.onOpenMenu}
      >
        <Icon
          name="dehaze"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    );
  }

  renderRetry() {
    return (
      <View style={styles.retryContainer}>
        <RetryButton
          onPress={this.onRetryPlips}
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

  onRefresh = () => {
    const {
      onRefresh,
    } = this.props;

    onRefresh();
  }

  onSendYourIdea = () => {
    const { onOpenURL, remoteLinks } = this.props;
    onOpenURL(remoteLinks.sendYourIdea);
  }

  onOpenMenu = () => {
    const { openMenu } = this.props;
    openMenu();
  }

  onRetryPlips = () => {
    const { onRetryPlips } = this.props;
    onRetryPlips();
  }
}
