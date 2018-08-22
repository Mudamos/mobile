import PropTypes from "prop-types";
import React, { Component } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
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

import RetryButton from "./retry-button";
import NetworkImage from "./network-image";
import FlatButton from "./flat-button";
import StaticFooter from "./static-footer";

import styles from "../styles/plips-list";

import locale from "../locales/pt-BR";
import {
  RemoteLinksType,
} from "../prop-types";

export default class PlipsList extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isFetchingPlipsNextPage: PropTypes.bool,
    isRefreshingPlips: PropTypes.bool,
    nextPage: PropTypes.number,
    openMenu: PropTypes.func.isRequired,
    plips: PropTypes.array,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    typeList: PropTypes.string.isRequired,
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
    const { isFetchingPlipsNextPage, onFetchPlipsNextPage, nextPage, typeList } = this.props;

    if (!isFetchingPlipsNextPage) onFetchPlipsNextPage({ typeList, nextPage });
  };

  get hasNextPage() {
    const { nextPage } = this.props;

    return !!nextPage;
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

  renderStaticFooter() {
    const { onOpenURL } = this.props;

    return (
      <View style={styles.footerContainer}>
        <StaticFooter onOpenURL={onOpenURL} />
      </View>
    )
  }

  renderListView({ plips, isRefreshingPlips }) {
    const {
      currentUser,
      isFetchingPlipsNextPage,
      plipsSignInfo,
      userSignInfo,
    } = this.props;

    const extraData = {
      currentUser,
      plipsSignInfo,
      userSignInfo,
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
        onEndReached={this.hasNextPage ? this.onFetchPlipsNextPage : null}
        onEndReachedThreshold={0.9}
        refreshing={isRefreshingPlips}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingPlips}
            onRefresh={this.onRefresh}
            tintColor="black"
          />
        }
        ListFooterComponent={isFetchingPlipsNextPage && this.renderInnerLoader({ animating: true }) || !this.hasNextPage && !isRefreshingPlips && this.renderStaticFooter()}
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
    return plip && plip.pictureThumb;
  }

  onRefresh = () => {
    const {
      onRefresh,
      typeList,
    } = this.props;

    onRefresh({ typeList });
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

export class Plip extends Component {
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
      signaturesCount,
    } = this.props;

    const customTotalSignatures = calcCustomTotalSignatures(signaturesCount);

    return (
      <TouchableOpacity
        onPress={this.onGoToPlip}
        style={styles.plipView}
      >
        <View style={styles.plipImageView}>
          <NetworkImage
            source={{uri: cover}}
            style={styles.plipImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.plipMainContainer}>
          <View style={[styles.plipHeaderContainer, hasSigned ? styles.plipHeaderContainerSigned : styles.plipHeaderContainerNotSigned]}>
            <View style={styles.plipTitleContainer}>
              <Text
                style={styles.plipTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {plip.title}
              </Text>
            </View>
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
              {plip.subtitle}
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
      </TouchableOpacity>
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
          color="rgba(0, 0, 0, .5)"
        />
      </TouchableOpacity>
    );
  }

  renderShareButton() {
    return (
      <TouchableOpacity
        onPress={this.onShare}
      >
        <Icon
          name="share"
          style={styles.shareIcon}
          size={30}
          color="rgba(0, 0, 0, .5)"
        />
      </TouchableOpacity>
    );
  }

  renderAssignmentIcon() {
    return (
      <Icon
        name="trending-up"
        style={styles.signaturesIcon}
        size={30}
        color="rgba(0, 0, 0, .5)"
      />
    );
  }

  renderAssignmentText(customTotalSignatures) {
    const hasMoreThan10 = customTotalSignatures > 10;
    const verbose = (customTotalSignatures > 1) ? locale.signatures.toLowerCase() : locale.signature.toLowerCase();

    return(
      <Text style={styles.plipSignatureText}>
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
