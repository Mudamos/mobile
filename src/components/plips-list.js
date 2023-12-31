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

import { calcCustomTotalSignatures } from "../models";

import Icon from "react-native-vector-icons/MaterialIcons";

import RetryButton from "./retry-button";
import NetworkImage from "./network-image";
import FlatButton from "./flat-button";
import StaticFooter from "./static-footer";

import styles from "../styles/plips-list";

import noPlipsImage from "../images/plip-page.png";

import locale from "../locales/pt-BR";
import { RemoteLinksType } from "../prop-types";

import { isBlank, notEmpty, notNil } from "../utils";

const refreshFlatStyle = {
  backgroundColor: "#00c084",
  marginTop: 10,
};

const refreshFlatTextStyle = { color: "#fff" };
const sendYourIdeaFlatStyle = { backgroundColor: "#00c084" };
const sendYourIdeaFlatTextStyle = { color: "#fff" };
const retryButtonStyle = { marginHorizontal: 20, backgroundColor: "#ddd" };

export default class PlipsList extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    fetchingError: PropTypes.bool,
    hasLoadedPlips: PropTypes.bool,
    isAddingFavoritePlip: PropTypes.bool,
    isFetchingPlips: PropTypes.bool,
    isFetchingPlipsNextPage: PropTypes.bool,
    isRefreshingPlips: PropTypes.bool,
    isSearchingPlips: PropTypes.bool,
    nextPage: PropTypes.number,
    openMenu: PropTypes.func.isRequired,
    plips: PropTypes.array,
    plipsFavoriteInfo: PropTypes.object,
    plipsSignInfo: PropTypes.object.isRequired,
    remoteLinks: RemoteLinksType,
    searchTitle: PropTypes.string,
    typeList: PropTypes.string.isRequired,
    userSignInfo: PropTypes.object.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
  };

  plipListKey = (item) => String(item.id);

  onGoToPlip = (plip) => {
    const { onGoToPlip } = this.props;
    onGoToPlip(plip);
  };

  onShare = (plip) => {
    const { onShare } = this.props;
    onShare(plip);
  };

  onFetchPlipsNextPage = () => {
    const {
      isFetchingPlipsNextPage,
      onFetchPlipsNextPage,
      nextPage,
      typeList,
    } = this.props;

    if (!isFetchingPlipsNextPage) onFetchPlipsNextPage({ typeList, nextPage });
  };

  get hasNextPage() {
    const { nextPage } = this.props;

    return !!nextPage;
  }

  get isFavoriteList() {
    const { typeList } = this.props;

    return typeList === "favoritePlips";
  }

  componentDidUpdate(prevProps) {
    const { isSearchingPlips, typeList } = this.props;

    if (
      typeList === "allPlips" &&
      isSearchingPlips &&
      isSearchingPlips !== prevProps.isSearchingPlips
    ) {
      this.flatList &&
        this.flatList.scrollToOffset({ offset: 1, animated: true });
    }
  }

  render() {
    const {
      fetchingError: error,
      hasLoadedPlips,
      isFetchingPlips,
      isRefreshingPlips,
      plips,
    } = this.props;

    const hasRows = plips && plips.length > 0;
    const shouldShowNoPlips = !error && !isFetchingPlips && !hasRows;

    return (
      <View style={styles.main}>
        {!error &&
          hasRows &&
          !isFetchingPlips &&
          this.renderListView({
            plips,
            isRefreshingPlips,
          })}

        {!!shouldShowNoPlips &&
          !isFetchingPlips &&
          hasLoadedPlips &&
          this.renderNoPlips()}
        {error && this.renderRetry()}
        {isFetchingPlips &&
          this.renderInnerLoader({ animating: isFetchingPlips })}
      </View>
    );
  }

  renderInnerLoader({ animating }) {
    return (
      <View style={styles.innerLoaderContainer}>
        <ActivityIndicator animating={animating} color="black" size="large" />
      </View>
    );
  }

  renderStaticFooter() {
    const { onOpenURL } = this.props;

    return (
      <View style={styles.footerContainer}>
        <StaticFooter onOpenURL={onOpenURL} />
      </View>
    );
  }

  renderListView({ plips, isRefreshingPlips }) {
    const {
      currentUser,
      isFetchingPlipsNextPage,
      plipsSignInfo,
      userSignInfo,
      isSearchingPlips,
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
        onEndReached={
          this.hasNextPage && !isFetchingPlipsNextPage
            ? this.onFetchPlipsNextPage
            : null
        }
        onEndReachedThreshold={0.9}
        ref={(ref) => {
          this.flatList = ref;
        }}
        refreshing={isRefreshingPlips || isSearchingPlips}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingPlips || isSearchingPlips}
            onRefresh={!isRefreshingPlips ? this.onRefresh : null}
            tintColor="black"
          />
        }
        ListFooterComponent={
          isFetchingPlipsNextPage
            ? this.renderInnerLoader({ animating: true })
            : !this.hasNextPage &&
              !isRefreshingPlips &&
              this.renderStaticFooter()
        }
      />
    );
  }

  renderRow = ({ height, margin }) => ({ item: plip, index }) => {
    const {
      currentUser,
      plipsFavoriteInfo,
      plipsSignInfo,
      userSignInfo,
      onToggleFavorite,
      isAddingFavoritePlip,
    } = this.props;

    const plipSignInfo = plipsSignInfo && plipsSignInfo[plip.id];
    const plipFavoriteInfo =
      plipsFavoriteInfo && plipsFavoriteInfo[plip.detailId];
    const isFavorite = notEmpty(plipFavoriteInfo) && notNil(plipFavoriteInfo);
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
        isFavorite={isFavorite || this.isFavoriteList}
        isAddingFavoritePlip={isAddingFavoritePlip}
        onToggleFavorite={onToggleFavorite}
        height={height}
        margin={margin}
      />
    );
  };

  renderCommonRow = this.renderRow({ height: 360, margin: 0 });

  renderNoPlips() {
    const { currentUser, searchTitle, typeList } = this.props;

    const isLogged = !!currentUser;

    switch (typeList) {
      case "allPlips":
        return (
          <View style={styles.noProjectsContainer}>
            <View style={styles.noProjectsInnerContainer}>
              <Image source={noPlipsImage} style={styles.noProjectsIcon} />

              {isBlank(searchTitle) ? (
                <Text style={styles.noProjectsText}>
                  {locale.noProjectsMatch}
                </Text>
              ) : (
                <View>
                  <Text style={styles.noProjectsText}>
                    {locale.searchPlipNotFound({ searchTitle })}
                  </Text>

                  <FlatButton
                    title={locale.clearSearch.toUpperCase()}
                    onPress={this.onRefresh}
                    style={refreshFlatStyle}
                    textStyle={refreshFlatTextStyle}
                  />
                </View>
              )}
            </View>
          </View>
        );

      case "signedPlips":
        return (
          <View style={styles.noProjectsContainer}>
            <View style={styles.noProjectsInnerContainer}>
              <Image source={noPlipsImage} style={styles.noProjectsIcon} />

              <Text style={styles.noProjectsText}>
                {isLogged
                  ? locale.noSignedProjects
                  : locale.youShouldBeLoggedToSeeYourSignedProjects}
              </Text>
            </View>
          </View>
        );

      case "favoritePlips":
        return (
          <View style={styles.noProjectsContainer}>
            <View style={styles.noProjectsInnerContainer}>
              <Image source={noPlipsImage} style={styles.noProjectsIcon} />

              <Text style={styles.noProjectsText}>
                {isLogged
                  ? locale.noFavoriteProjects
                  : locale.youShouldBeLoggedToSeeYourFavoriteProjects}
              </Text>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.noProjectsContainer}>
            <View style={styles.noProjectsInnerContainer}>
              <Image source={noPlipsImage} style={styles.noProjectsIcon} />

              <Text style={styles.noProjectsText}>{locale.noProjectsYet}</Text>
            </View>

            <FlatButton
              title={locale.links.sendYourIdea.toUpperCase()}
              onPress={this.onSendYourIdea}
              style={sendYourIdeaFlatStyle}
              textStyle={sendYourIdeaFlatTextStyle}
            />
          </View>
        );
    }
  }

  renderRetry() {
    return (
      <View style={styles.retryContainer}>
        <RetryButton onPress={this.onRetryPlips} style={retryButtonStyle} />
      </View>
    );
  }

  plipImage(plip) {
    return plip && plip.pictureThumb;
  }

  onRefresh = () => {
    const { onRefresh, typeList } = this.props;

    onRefresh({ typeList });
  };

  onSendYourIdea = () => {
    const { onOpenURL, remoteLinks } = this.props;
    onOpenURL(remoteLinks.sendYourIdea);
  };

  onRetryPlips = () => {
    const { onRetryPlips } = this.props;
    onRetryPlips();
  };
}

export class Plip extends Component {
  static propTypes = {
    cover: PropTypes.string,
    hasSigned: PropTypes.bool,
    height: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    isAddingFavoritePlip: PropTypes.bool,
    isFavorite: PropTypes.bool,
    margin: PropTypes.number.isRequired,
    plip: PropTypes.object.isRequired,
    plipsFavoriteInfo: PropTypes.object,
    signaturesCount: PropTypes.number,
    user: PropTypes.object,
    onGoToPlip: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    const { props } = this;

    const shouldUpdate =
      props.index !== nextProps.index ||
      props.plip.id !== nextProps.plip.id ||
      props.height !== nextProps.height ||
      props.margin !== nextProps.margin ||
      props.user !== nextProps.user ||
      props.signaturesCount !== nextProps.signaturesCount ||
      props.isFavorite !== nextProps.isFavorite ||
      props.hasSigned !== nextProps.hasSigned ||
      props.isAddingFavoritePlip !== nextProps.isAddingFavoritePlip ||
      props.plipsFavoriteInfo !== nextProps.plipsFavoriteInfo;

    return shouldUpdate;
  }

  onGoToPlip = () => {
    const { plip, onGoToPlip } = this.props;

    onGoToPlip(plip);
  };

  onToggleFavorite = () => {
    const { plip, onToggleFavorite, isAddingFavoritePlip } = this.props;

    !isAddingFavoritePlip && onToggleFavorite(plip.detailId);
  };

  onShare = () => {
    const { plip, onShare } = this.props;
    onShare(plip);
  };

  render() {
    const {
      plip,

      height,
      margin,
    } = this.props;

    return (
      <View
        style={[
          styles.rowContainer,
          {
            minHeight: height,
            margin,
          },
        ]}>
        {this.renderPlip({ plip })}
      </View>
    );
  }

  renderPlip({ plip }) {
    const { cover, hasSigned, signaturesCount } = this.props;

    const customTotalSignatures = calcCustomTotalSignatures(signaturesCount);

    return (
      <TouchableOpacity onPress={this.onGoToPlip} style={styles.plipView}>
        <View style={styles.plipImageView}>
          <NetworkImage
            source={{ uri: cover }}
            style={styles.plipImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.plipMainContainer}>
          <View
            style={[
              styles.plipHeaderContainer,
              hasSigned
                ? styles.plipHeaderContainerSigned
                : styles.plipHeaderContainerNotSigned,
            ]}>
            <View style={styles.plipTitleContainer}>
              <Text
                style={styles.plipTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {plip.title}
              </Text>
            </View>
            {hasSigned && (
              <View style={styles.plipSignedContainer}>
                <Text style={styles.plipSignedText}>Assinado</Text>
                {this.renderSignedIcon()}
              </View>
            )}
          </View>
          <View style={styles.plipSubtitleContainer}>
            <Text>{plip.subtitle}</Text>
          </View>
          <View style={styles.plipOptionsContainer}>
            <View style={styles.plipSignatureContainer}>
              {this.renderAssignmentIcon()}
              {customTotalSignatures &&
                this.renderAssignmentText(customTotalSignatures)}
            </View>
            <View style={styles.plipOptions}>
              {this.renderFavoriteButton()}
              {this.renderShareButton()}
            </View>
          </View>
          <View style={styles.purple}>{this.renderDetailLinkButton()}</View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSignedIcon() {
    return (
      <Icon
        name="check-circle"
        style={styles.signedIcon}
        size={30}
        color="#00000048"
      />
    );
  }

  renderFavoriteButton() {
    const { user, isFavorite } = this.props;

    const isLogged = !!user;
    const iconShape = isFavorite ? "favorite-border" : "favorite";

    if (!isLogged) return;

    return (
      <TouchableOpacity onPress={this.onToggleFavorite}>
        <Icon
          name={iconShape}
          style={styles.favoriteIcon}
          size={30}
          color="rgba(0, 0, 0, .5)"
        />
      </TouchableOpacity>
    );
  }

  renderShareButton() {
    return (
      <TouchableOpacity onPress={this.onShare}>
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
    const verbose =
      customTotalSignatures > 1
        ? locale.signatures.toLowerCase()
        : locale.signature.toLowerCase();

    return (
      <Text style={styles.plipSignatureText}>
        {hasMoreThan10 && "+ de"} {customTotalSignatures} {verbose}
      </Text>
    );
  }

  renderDetailLinkButton() {
    return (
      <TouchableOpacity
        onPress={this.onGoToPlip}
        style={[styles.plipDetailsLinkContainer]}>
        <Animated.Text style={styles.plipDetailsLink}>
          {locale.moreInfo.toUpperCase()}
        </Animated.Text>
      </TouchableOpacity>
    );
  }
}
