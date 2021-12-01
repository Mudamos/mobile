import React, { Component } from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import {
  ActionSheetProvider,
  connectActionSheet,
} from "@expo/react-native-action-sheet";

import { compose } from "recompose";

import PropTypes from "prop-types";

import { prop, sortBy } from "ramda";

import { connectPermissionService } from "../providers/permisson-provider";

import { isDev } from "../utils";

import locale from "../locales/pt-BR";

import {
  fetchProfile,
  fetchPlips,
  fetchPlipsNextPage,
  logEvent,
  logout,
  navigate,
  openURL,
  profileSaveAvatar,
  refreshPlips,
  tellAFriend,
  sharePlip,
  updateMainTabViewIndex,
  userFirstTimeDone,
  validateProfile,
  clearSearchPlip,
  requestCameraAccess,
  requestGalleryAccess,
  searchPlip,
  setCurrentPlip,
  toggleFavorite,
  permissionRemoveUnauthorized,
} from "../actions";

import {
  appLoadingProgress,
  getCurrentAuthorizedPermission,
  isAppReady,
  isFetchingPlipsNextPageAllPlips,
  isFetchingPlipsNextPageFavoritePlips,
  isFetchingPlipsNextPageNationwidePlips,
  isFetchingPlipsNextPagePlipsByLocation,
  isFetchingPlipsNextPageSignedPlips,
  isRefreshingAllPlips,
  isRefreshingNationwidePlips,
  isRefreshingPlipsByLocation,
  isRefreshingSignedPlips,
  isRefreshingFavoritePlips,
  errorFetchingAllPlips,
  errorFetchingNationwidePlips,
  errorFetchingSignedPlips,
  errorFetchingUserFavoritePlips,
  errorFetchingUserLocationPlips,
  currentUser as getCurrentUser,
  getCurrentMainTabView,
  getMainTabView,
  getUserSignInfo,
  isAddingFavoritePlip,
  isFetchingProfile,
  isFetchingAllPlips,
  isFetchingNationwidePlips,
  isFetchingPlipsByLocation,
  isFetchingSignedPlips,
  isFetchingFavoritePlips,
  isSearchingPlips,
  isUserFirstTime,
  isUserLoggedIn,
  findNationwidePlips,
  findUserLocationPlips,
  findUserFavoritePlips,
  findAllPlips,
  findSignedPlips,
  findNationwidePlipsNextPage,
  findUserLocationPlipsNextPage,
  findAllPlipsNextPage,
  findUserFavoritePlipsNextPage,
  findSignedPlipsNextPage,
  findRemoteLinks,
  findPlipsFavoriteInfo,
  findPlipsSignInfo,
  getCurrentSigningPlip,
  hasLoadedAllPlips,
  hasLoadedNationwidePlips,
  hasLoadedSignedPlips,
  hasLoadedUserFavoritePlips,
  hasLoadedUserLocationPlips,
  isValidatingProfile,
  searchPlipTitle,
  getUnauthorizedPermissions,
} from "../selectors";

import { SCREEN_KEYS } from "../models";

import TrackingTransparencyModal from "../components/tracking-transparency-modal";
import PageLoader from "../components/page-loader";
import PlipsLayout from "../components/plips-layout";
import SplashLoader from "../components/splash-loader";
import Menu from "../components/side-menu";
import LoggedInMenuContent from "../components/logged-in-menu-content";

import Toast from "react-native-simple-toast";

import { RemoteLinksType } from "../prop-types/remote-config";

const LoggedInMenu = connectActionSheet(LoggedInMenuContent);

const sortMenuEntries = (entries) => sortBy(prop("position"), entries);

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .6)",
  },
});

class Container extends Component {
  openMenu = () => {
    const { onFetchProfile } = this.props;

    this.setState({ menuOpen: true });
    onFetchProfile();
  };

  onScan = () => {
    const { onTapScan, onLogEvent } = this.props;

    onTapScan();
    onLogEvent({ name: "tapped_menu_qr_code_scan" });
  };

  onAbout = () => {
    const { onTapAboutApp, onLogEvent } = this.props;

    onTapAboutApp();
    onLogEvent({ name: "tapped_menu_about_app" });
  };

  onPrivacyPolicy = () => {
    const { onLogEvent, onPrivacyPolicy } = this.props;
    onLogEvent({ name: "tapped_menu_privacy_policy" });
    onPrivacyPolicy();
  };

  onTellAFriend = () => {
    const { onLogEvent, onTellAFriend } = this.props;
    onLogEvent({ name: "tapped_menu_tell_a_friend" });
    onTellAFriend();
  };

  onHelp = () => {
    const { onTapHelp, onLogEvent } = this.props;

    onTapHelp();
    onLogEvent({ name: "tapped_menu_help" });
  };

  onSendYourPl = () => {
    const { onTapSendYourPl, onLogEvent } = this.props;

    onTapSendYourPl();
    onLogEvent({ name: "tapped_menu_send_your_pl" });
  };

  onSignIn = () => {
    const { onSignIn, onLogEvent } = this.props;

    onSignIn();
    onLogEvent({ name: "tapped_menu_signup" });
  };

  menuEntries = () => {
    const {
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      onProfileEdit,
    } = this.props;

    const entries = [
      {
        icon: "qr-code-scanner",
        title: locale.menu.scanner,
        action: this.onScan,
        position: 2,
      },
      {
        icon: "bubble-chart",
        title: locale.menu.about,
        action: this.onAbout,
        position: 3,
      },
      {
        icon: "account-balance",
        title: locale.links.sendYourPL,
        action: this.onSendYourPl,
        position: 4,
      },
      {
        icon: "help",
        title: locale.menu.help,
        action: this.onHelp,
        position: 6,
      },
      {
        icon: "description",
        title: locale.menu.privacyPolicy,
        action: this.onPrivacyPolicy,
        position: 7,
      },
      {
        icon: "share",
        title: locale.menu.tellAFriend,
        action: this.onTellAFriend,
        position: 8,
      },
    ];

    if (!isFetchingProfile && currentUser) {
      entries.push({
        icon: "account-circle",
        title: locale.menu.myProfile,
        action: onProfileEdit,
        position: 0,
      });
    }

    if (!isFetchingProfile && !currentUser && !isUserLoggedIn) {
      entries.push({
        icon: "person",
        title: locale.getIn,
        action: this.onSignIn,
        position: 0,
      });
    }

    return sortMenuEntries(entries);
  };

  state = {
    menuOpen: false,
    menuOptions: this.menuEntries(),
  };

  static propTypes = {
    allPlips: PropTypes.array,
    appLoadingProgress: PropTypes.number,
    currentSigningPlip: PropTypes.object,
    currentUser: PropTypes.object,
    errorFetchingAllPlips: PropTypes.bool,
    errorFetchingNationwidePlips: PropTypes.bool,
    errorFetchingSignedPlips: PropTypes.bool,
    errorFetchingUserFavoritePlips: PropTypes.bool,
    errorFetchingUserLocationPlips: PropTypes.bool,
    isAddingFavoritePlip: PropTypes.bool,
    isAppReady: PropTypes.bool,
    isFetchingAllPlips: PropTypes.bool.isRequired,
    isFetchingFavoritePlips: PropTypes.bool.isRequired,
    isFetchingNationwidePlips: PropTypes.bool.isRequired,
    isFetchingPlipsByLocation: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageAllPlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageFavoritePlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageNationwidePlips: PropTypes.bool.isRequired,
    isFetchingPlipsNextPagePlipsByLocation: PropTypes.bool.isRequired,
    isFetchingPlipsNextPageSignedPlips: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isFetchingSignedPlips: PropTypes.bool.isRequired,
    isRefreshingAllPlips: PropTypes.bool.isRequired,
    isRefreshingFavoritePlips: PropTypes.bool.isRequired,
    isRefreshingNationwidePlips: PropTypes.bool.isRequired,
    isRefreshingPlipsByLocation: PropTypes.bool.isRequired,
    isRefreshingSignedPlips: PropTypes.bool.isRequired,
    isSearchingPlips: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    isValidatingProfile: PropTypes.bool,
    nationwidePlips: PropTypes.array,
    remoteLinks: RemoteLinksType,
    signedPlips: PropTypes.array,
    userLocationPlips: PropTypes.array,
    onAvatarChanged: PropTypes.func.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onFirstTimeModalClose: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onLogEvent: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPrivacyPolicy: PropTypes.func.isRequired,
    onProfileEdit: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onTapAboutApp: PropTypes.func.isRequired,
    onTapHelp: PropTypes.func.isRequired,
    onTapScan: PropTypes.func.isRequired,
    onTapSendYourPl: PropTypes.func.isRequired,
    onTellAFriend: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
    onValidateProfile: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const {
      currentUser,
      isFetchingProfile,
      onProfileEdit,
      isUserLoggedIn,
    } = this.props;

    if (
      isFetchingProfile !== prevProps.isFetchingProfile ||
      currentUser !== prevProps.currentUser ||
      onProfileEdit !== prevProps.onProfileEdit ||
      isUserLoggedIn !== prevProps.isUserLoggedIn
    ) {
      this.updateMenuOptions();
    }
  }

  componentDidMount() {
    const { currentSigningPlip, onGoToPlip } = this.props;

    if (isDev) Toast.show("PlipsList componentDidMount");

    if (currentSigningPlip) {
      // For some reason, the router is not done loading the current screen
      // and will dispatch the current view after this.
      // It's like only the navigation controller was loaded.
      // The hack actually works without setting a waiting time,
      // be here we give some window becuase we are not sure why this happens.
      // `router-flux` issue?
      setTimeout(() => onGoToPlip(currentSigningPlip), 500);
    }
  }

  updateMenuOptions = () => {
    const menuOptions = this.menuEntries();
    this.setState({ menuOptions });
  };

  render() {
    const { isAppReady, isValidatingProfile, onFetchProfile } = this.props;
    const { menuOpen: open } = this.state;

    return (
      <View style={styles.full}>
        <ActionSheetProvider>
          <Menu
            open={open}
            acceptPan={false}
            content={this.renderMenuContent()}
            onOpenStart={onFetchProfile}
            onOpen={() => this.setState({ menuOpen: true })}
            onClose={() => this.setState({ menuOpen: false })}>
            {this.renderPage()}
            {this.renderFirstTimeLoader()}
          </Menu>
        </ActionSheetProvider>

        {isAppReady && <TrackingTransparencyModal />}
        <PageLoader isVisible={isValidatingProfile} />
      </View>
    );
  }

  renderPage() {
    const { menuOpen } = this.state;

    return (
      <View style={styles.full}>
        <PlipsLayout {...this.props} openMenu={this.openMenu} />

        {menuOpen && <View style={styles.menuOverlay} />}
      </View>
    );
  }

  renderFirstTimeLoader() {
    const { isAppReady, appLoadingProgress } = this.props;
    return (
      <SplashLoader isVisible={!isAppReady} progress={appLoadingProgress} />
    );
  }

  renderMenuContent() {
    const {
      authorizedPermission,
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      permission,
      unauthorizedPermissions,
      onAvatarChanged,
      onLogout,
      onRequestCameraPermission,
      onRequestGalleryPermission,
      onRemoveUnauthorizedPermission,
    } = this.props;
    const { menuOptions } = this.state;

    return (
      <LoggedInMenu
        authorizedPermission={authorizedPermission}
        currentUser={currentUser}
        isFetchingProfile={isFetchingProfile}
        isUserLoggedIn={isUserLoggedIn}
        permission={permission}
        onAvatarChanged={onAvatarChanged}
        onLogout={onLogout}
        onRequestCameraPermission={onRequestCameraPermission}
        onRequestGalleryPermission={onRequestGalleryPermission}
        menuEntries={menuOptions}
        unauthorizedPermissions={unauthorizedPermissions}
        onRemoveUnauthorizedPermission={onRemoveUnauthorizedPermission}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  appLoadingProgress: appLoadingProgress(state),
  authorizedPermission: getCurrentAuthorizedPermission(state),
  currentSigningPlip: getCurrentSigningPlip(state),
  currentUser: getCurrentUser(state),
  errorFetchingAllPlips: errorFetchingAllPlips(state),
  errorFetchingNationwidePlips: errorFetchingNationwidePlips(state),
  errorFetchingSignedPlips: errorFetchingSignedPlips(state),
  errorFetchingUserFavoritePlips: errorFetchingUserFavoritePlips(state),
  errorFetchingUserLocationPlips: errorFetchingUserLocationPlips(state),
  currentMainTabViewTab: getCurrentMainTabView(state),
  isAppReady: isAppReady(state),
  isFetchingPlipsNextPageAllPlips: isFetchingPlipsNextPageAllPlips(state),
  isFetchingPlipsNextPageFavoritePlips: isFetchingPlipsNextPageFavoritePlips(
    state,
  ),
  isFetchingPlipsNextPageNationwidePlips: isFetchingPlipsNextPageNationwidePlips(
    state,
  ),
  isFetchingPlipsNextPagePlipsByLocation: isFetchingPlipsNextPagePlipsByLocation(
    state,
  ),
  isFetchingPlipsNextPageSignedPlips: isFetchingPlipsNextPageSignedPlips(state),
  isFetchingAllPlips: isFetchingAllPlips(state),
  isFetchingFavoritePlips: isFetchingFavoritePlips(state),
  isFetchingNationwidePlips: isFetchingNationwidePlips(state),
  isFetchingPlipsByLocation: isFetchingPlipsByLocation(state),
  isAddingFavoritePlip: isAddingFavoritePlip(state),
  isFetchingProfile: isFetchingProfile(state),
  isFetchingSignedPlips: isFetchingSignedPlips(state),
  isSearchingPlips: isSearchingPlips(state),
  isRefreshingAllPlips: isRefreshingAllPlips(state),
  isRefreshingFavoritePlips: isRefreshingFavoritePlips(state),
  isRefreshingNationwidePlips: isRefreshingNationwidePlips(state),
  isRefreshingPlipsByLocation: isRefreshingPlipsByLocation(state),
  isRefreshingSignedPlips: isRefreshingSignedPlips(state),
  isUserFirstTime: isUserFirstTime(state),
  isUserLoggedIn: isUserLoggedIn(state),
  isValidatingProfile: isValidatingProfile(state),
  nationwidePlips: findNationwidePlips(state),
  userLocationPlips: findUserLocationPlips(state),
  favoritePlips: findUserFavoritePlips(state),
  loadedAllPlips: hasLoadedAllPlips(state),
  loadedNationwidePlips: hasLoadedNationwidePlips(state),
  loadedSignedPlips: hasLoadedSignedPlips(state),
  loadedUserFavoritePlips: hasLoadedUserFavoritePlips(state),
  loadedUserLocationPlips: hasLoadedUserLocationPlips(state),
  allPlips: findAllPlips(state),
  signedPlips: findSignedPlips(state),
  nationwidePlipsNextPage: findNationwidePlipsNextPage(state),
  userLocationPlipsNextPage: findUserLocationPlipsNextPage(state),
  favoritePlipsNextPage: findUserFavoritePlipsNextPage(state),
  allPlipsNextPage: findAllPlipsNextPage(state),
  signedPlipsNextPage: findSignedPlipsNextPage(state),
  remoteLinks: findRemoteLinks(state),
  plipsSignInfo: findPlipsSignInfo(state),
  searchTitle: searchPlipTitle(state),
  tabViewState: getMainTabView(state),
  userSignInfo: getUserSignInfo(state),
  plipsFavoriteInfo: findPlipsFavoriteInfo(state),
  unauthorizedPermissions: getUnauthorizedPermissions(state),
});

const mapDispatchToProps = (dispatch) => ({
  onAvatarChanged: (avatar) =>
    dispatch(profileSaveAvatar({ avatar, shouldNavigate: false })),
  onRetryPlips: () => dispatch(fetchPlips()),
  onFetchPlipsNextPage: ({ typeList, nextPage }) =>
    dispatch(fetchPlipsNextPage({ typeList, nextPage })),
  onFetchProfile: () => dispatch(fetchProfile()),
  onFirstTimeModalClose: () => dispatch(userFirstTimeDone()),
  onGoToPlip: (plip) => {
    dispatch(navigate("showPlip"));
    dispatch(setCurrentPlip(plip));
  },
  onLogEvent: ({ name, extraData }) => dispatch(logEvent({ name, extraData })),
  onLogout: () => dispatch(logout()),
  onOpenURL: (url) => dispatch(openURL(url)),
  onPrivacyPolicy: () => dispatch(navigate(SCREEN_KEYS.PRIVACY_POLICY)),
  onProfileEdit: () => dispatch(navigate("profileUpdate")),
  onRefresh: ({ typeList }) => dispatch(refreshPlips({ typeList })),
  onSignIn: () => dispatch(navigate("signIn")),
  onTapAboutApp: () => dispatch(navigate("aboutApp")),
  onTapScan: () => dispatch(navigate(SCREEN_KEYS.SCANNER)),
  onTapHelp: () => dispatch(navigate("help")),
  onTapSendYourPl: () => dispatch(navigate("sendYourPl")),
  onMainTabChange: ({ index }) => dispatch(updateMainTabViewIndex(index)),
  onTellAFriend: () => dispatch(tellAFriend()),
  onValidateProfile: () => dispatch(validateProfile()),
  onClearSearch: () => dispatch(clearSearchPlip()),
  onRequestCameraPermission: () => dispatch(requestCameraAccess()),
  onRequestGalleryPermission: () => dispatch(requestGalleryAccess()),
  onSearchPlip: (title) => dispatch(searchPlip(title)),
  onShare: (plip) => dispatch(sharePlip(plip)),
  onToggleFavorite: (detailId) => dispatch(toggleFavorite({ detailId })),
  onRemoveUnauthorizedPermission: (permission) =>
    dispatch(permissionRemoveUnauthorized(permission)),
});

const enhance = compose(
  connectPermissionService,
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Container);
