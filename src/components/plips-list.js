import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  Text,
  Animated,
  View,
} from "react-native";

import {
  calcCustomTotalSignatures,
} from "../models";

import Icon from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";

import RetryButton from "./retry-button";
import NetworkImage from "./network-image";
import FlatButton from "./flat-button";

import styles from "../styles/plips-list";

import locale from "../locales/pt-BR";
import {
  RemoteLinksType,
  SignatureGoalsType,
} from "../prop-types";

export default class PlipsList extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isFetchingPlipsNextPage: PropTypes.bool,
    isRefreshingPlips: PropTypes.bool,
    openMenu: PropTypes.func.isRequired,
    plips: PropTypes.array,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    signatureGoals: PropTypes.shape({
      [PropTypes.string]: SignatureGoalsType,
    }).isRequired,
    userSignInfo: PropTypes.object.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  }

  plipListKey = item => String(item.id);

  onGoToPlip = plip => {
    const { onGoToPlip } = this.props;
    onGoToPlip(plip);
  }

  onShare = plip => {
    const { onShare } = this.props;
    onShare(plip);
  }

  onFetchPlipsNextPage = () => {
    const { isFetchingPlipsNextPage, onFetchPlipsNextPage } = this.props;

    if (!isFetchingPlipsNextPage) onFetchPlipsNextPage();
  };

  plipSignatureGoals(plipId) {
    const { signatureGoals } = this.props;
    return signatureGoals[plipId];
  }

  render() {
    const {
      errorFetchingPlips: error,
      isFetchingPlips,
      isRefreshingPlips,
      plips,
    } = this.props;

    const hasRows = plips && plips.length > 0;
    const shouldShowNoPlips =
      !error &&
      !isFetchingPlips &&
      !hasRows;

    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        {
          !error && hasRows &&
            this.renderListView({
              plips,
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

  renderListView({ plips, isRefreshingPlips }) {
    const {
      currentUser,
      hasNextPage,
      isFetchingPlipsNextPage,
      plipsSignInfo,
      userSignInfo,
      signatureGoals,
    } = this.props;

    const extraData = {
      currentUser,
      plipsSignInfo,
      userSignInfo,
      signatureGoals,
    };

    return (
      <FlatList
        style={styles.listView}
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={500}
        keyExtractor={this.plipListKey}
        data={plips}
        renderItem={this.renderCommonRow}
        extraData={extraData}
        onEndReached={hasNextPage ? this.onFetchPlipsNextPage : null}
        onEndReachedThreshold={0.9}
        refreshing={isRefreshingPlips}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingPlips}
            onRefresh={this.onRefresh}
            tintColor="black"
          />
        }
        ListFooterComponent={isFetchingPlipsNextPage && this.renderInnerLoader({ animating: true })}
      />
    );
  }

  renderRow = ({ height, margin }) => ({ item: plip, index }) => {
    const {
      currentUser,
      plipsSignInfo,
      userSignInfo,
    } = this.props;

    const plipSignInfo = plipsSignInfo && plipsSignInfo[plip.id];
    const plipUserSignInfo = userSignInfo && userSignInfo[plip.id];
    const hasSigned = !!(plipUserSignInfo && plipUserSignInfo.updatedAt);
    const cover = this.plipImage(plip);

    return (
      <Plip
        user={currentUser}
        index={index}
        plip={plip}
        cover={cover}
        signaturesCount={plipSignInfo && plipSignInfo.signaturesCount}
        hasSigned={hasSigned}
        onShare={this.onShare}
        onGoToPlip={this.onGoToPlip}

        height={height}
        margin={margin}
      />
    );
  }

  renderCommonRow = this.renderRow({ height: 360, margin: 0 });

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

  plipImage(plip) {
    return plip.cycle && plip.cycle.pictures && plip.cycle.pictures.thumb;
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

  onRetryPlips = () => {
    const { onRetryPlips } = this.props;
    onRetryPlips();
  }
}

class Plip extends Component {
  static propTypes = {
    cover: PropTypes.string,
    hasSigned: PropTypes.bool,
    height: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    margin: PropTypes.number.isRequired,
    plip: PropTypes.object.isRequired,
    signaturesCount: PropTypes.number,
    user: PropTypes.object,
    onGoToPlip: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;

    const shouldUpdate = props.index !== nextProps.index
      || props.plip.id !== nextProps.plip.id
      || props.height !== nextProps.height
      || props.margin !== nextProps.margin
      || props.user !== nextProps.user
      || props.signaturesCount !== nextProps.signaturesCount
      || props.hasSigned !== nextProps.hasSigned

      return shouldUpdate;
  }

  onGoToPlip = () => {
    const { plip, onGoToPlip } = this.props;

    onGoToPlip(plip);
  }

  onShare = () => {
    const { plip, onShare } = this.props;
    onShare(plip);
  }

  render() {
    const {
      index,
      plip,

      height,
      margin,
    } = this.props;

    return (
      <View
        style={[styles.rowContainer, {
          minHeight: height,
          margin,
        }]}
      >
        {this.renderPlip({ plip })}
      </View>
    );
  }

  renderPlip({ plip }) {
    const {
      cover,
      hasSigned,
      user,
      signaturesCount,
    } = this.props;

    // Not every animation seem to work on both platforms
    const AnimatableView = Platform.OS === "ios" ? Animatable.View : View;

    const customTotalSignatures = calcCustomTotalSignatures(signaturesCount);

    return (
      <View style={styles.pliView}>
        <View style={styles.plipImageView}>
          <NetworkImage
            source={{uri: cover}}
            style={styles.plipImage}
            resizeMode="cover"
          />
        </View>
        <View>
          <View style={[styles.plipTitleContainer, hasSigned ? styles.plipTitleContainerSigned : styles.plipTitleContainerNotSigned]}>
            <Text
              style={styles.plipTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {plip.phase.name}
            </Text>
            { hasSigned &&
              <View style={styles.plipSignedContainer}>
                <Text style={styles.plipSignedText}>
                  Assinado
                </Text>
                {this.renderSignedIcon()}
              </View>
            }
          </View>
          <View style={styles.plipSubtitleContainer}>
            <Text>
              {plip.phase.description}
            </Text>
          </View>
          <View style={styles.plipOptionsContainer}>
            <View style={styles.plipSignatureContainer}>
              {this.renderAssignmentIcon()}
              {customTotalSignatures && this.renderAssignmentText(customTotalSignatures)}
            </View>
            <View style={styles.plipOptions}>
              {this.renderFavoriteButton()}
              {this.renderShareButton()}
            </View>
          </View>
          <View style={{backgroundColor: "#7705B9"}}>
            {this.renderDetailLinkButton()}
          </View>
        </View>
      </View>
    )
  }

  renderSignedIcon() {
    return(
      <Icon
        name="check-circle"
        style={styles.signedIcon}
        size={30}
        color="#00000048"
      />
    );
  }

  // TODO Add Favorite link
  renderFavoriteButton() {
    return (
      <TouchableOpacity
      >
        <Icon
          name="favorite"
          style={styles.favoriteIcon}
          size={30}
          color="#00000080"
        />
      </TouchableOpacity>
    );
  }

  renderShareButton() {
    const {
      onShare
    } = this.props;


    return (
      <TouchableOpacity
        onPress={this.onShare}
      >
        <Icon
          name="share"
          style={styles.shareIcon}
          size={30}
          color="#00000080"
        />
      </TouchableOpacity>
    );
  }

  renderAssignmentIcon() {
    return (
      <Icon
        name="assignment"
        style={styles.signaturesIcon}
        size={30}
        color="#00000080"
      />
    );
  }

  renderAssignmentText(customTotalSignatures) {
    hasMoreThan10 = customTotalSignatures > 10;
    verbose = (customTotalSignatures > 1) ? locale.signatures.toLowerCase() : locale.signature.toLowerCase();

    return(
      <Text>
        {hasMoreThan10 && "+ de" } {customTotalSignatures} {verbose}
      </Text>
    );
  }

  renderDetailLinkButton() {
    return (
      <TouchableOpacity
        onPress={this.onGoToPlip}
        style={[styles.plipDetailsLinkContainer]}
      >
        <Animated.Text style={styles.plipDetailsLink}>
          {locale.moreInfo.toUpperCase()}
        </Animated.Text>
      </TouchableOpacity>
    );
  }
}
