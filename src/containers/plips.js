import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
} from "react-native";

import PropTypes from "prop-types";

import {
  prop,
  sortBy,
} from "ramda";

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
  searchPlip,
  setCurrentPlip,
  toggleFavorite,
} from "../actions";

import {
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
} from "../selectors";

import PageLoader from "../components/page-loader";
import PlipsLayout from "../components/plips-layout";
import SplashLoader from "../components/splash-loader";
import Menu from "../components/side-menu";
import LoggedInMenu from "../components/logged-in-menu-content";
import SimpleModal from "../components/simple-modal";
import MarkdownView from "../containers/markdown-view";

import Toast from "react-native-simple-toast";
import aboutHtmlStyles from "../styles/about-html-styles";

import { RemoteLinksType } from "../prop-types/remote-config";


const sortMenuEntries = entries => sortBy(prop("position"), entries);

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
});

class Container extends Component {
  state = {
    menuOpen: false,
    showAboutModal: false,
  };

  static propTypes = {
    allPlips: PropTypes.array,
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
    onProfileEdit: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignIn: PropTypes.func.isRequired,
    onTellAFriend: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
    onValidateProfile: PropTypes.func.isRequired,
  };

  get menuEntries() {
    const {
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      remoteLinks,
      onProfileEdit,
    } = this.props;

    const entries = [
      { icon: "bubble-chart", title: locale.menu.about, action: this.onAbout, position: 2 },
      { icon: "account-balance", title: locale.links.sendYourPL, action: () => this.onOpenURL({ eventName: "tapped_menu_send_your_pl", link: remoteLinks.sendYourIdea }), position: 3 },
      { icon: "help", title: locale.menu.help, action: () => this.onOpenURL({ eventName: "tapped_menu_help", link: remoteLinks.help }), position: 5 },
      { icon: "share", title: locale.menu.tellAFriend, action: this.onTellAFriend, position: 6 },
    ];

    if (!isFetchingProfile && currentUser) {
      entries.push({ icon: "account-circle", title: locale.menu.myProfile, action: onProfileEdit, position: 0 });
    }

    if (!isFetchingProfile && !currentUser && !isUserLoggedIn) {
      entries.push({ icon: "person", title: locale.getIn, action: this.onSignIn, position: 0});
    }

    return sortMenuEntries(entries);
  }

  componentWillMount() {
    if (isDev) Toast.show("PlipsList componentWillMount");
  }

  componentDidMount() {
    const {
      currentSigningPlip,
      onGoToPlip,
    } = this.props;

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUserFirstTime === true && !this.state.showAboutModal) {
      this.setState({ showAboutModal: true });
    }
  }

  render() {
    const { isValidatingProfile, onFetchProfile } = this.props;
    const { menuOpen: open } = this.state;

    return (
      <View style={styles.full}>
        <Menu
          open={open}
          content={this.renderMenuContent()}
          onOpenStart={onFetchProfile}
          onOpen={() => this.setState({ menuOpen: true })}
          onClose={() => this.setState({ menuOpen: false })}
        >
          {this.renderPage()}
          {this.renderFirstTimeLoader()}
        </Menu>

        <PageLoader isVisible={isValidatingProfile} />
      </View>
    );
  }

  renderPage() {
    const {
      showAboutModal,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <PlipsLayout
          {...this.props}

          openMenu={this.openMenu}
        />

        {
          showAboutModal &&
            <SimpleModal
              onClose={this.onFirstTimeModalClose}
            >
              <MarkdownView
                content={locale.markdown.aboutBody}
                contentContainerStyle={aboutHtmlStyles}
              />
            </SimpleModal>
        }
      </View>
    );
  }

  renderFirstTimeLoader() {
    const { isAppReady } = this.props;
    return <SplashLoader isVisible={!isAppReady} />
  }

  renderMenuContent() {
    const {
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      onAvatarChanged,
      onLogout,
    } = this.props;

    return (
      <LoggedInMenu
        currentUser={currentUser}
        isFetchingProfile={isFetchingProfile}
        isUserLoggedIn={isUserLoggedIn}
        onAvatarChanged={onAvatarChanged}
        onLogout={onLogout}

        menuEntries={this.menuEntries}
      />
    );
  }

  openMenu = () => {
    const { onFetchProfile } = this.props;

    this.setState({ menuOpen: true });
    onFetchProfile();
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  onAbout = () => {
    const {
      onTapAboutApp,
      onLogEvent,
    } = this.props;

    this.closeMenu();
    onTapAboutApp();
    onLogEvent({ name: "tapped_menu_about_app" });
  }

  onTellAFriend = () => {
    const { onLogEvent, onTellAFriend } = this.props;
    onLogEvent({ name: "tapped_menu_tell_a_friend" });
    onTellAFriend();
  }

  onOpenURL({ eventName, link }) {
    const { onLogEvent, onOpenURL } = this.props;
    onLogEvent({ name: eventName });
    onOpenURL(link);
  }

  onFirstTimeModalClose = () => {
    const { onFirstTimeModalClose } = this.props;

    onFirstTimeModalClose();
    this.setState({ showAboutModal: false });
  }

  onSignIn = () => {
    const { onSignIn, onLogEvent } = this.props;

    onSignIn();
    this.closeMenu();
    onLogEvent({ name: "tapped_menu_signup" });
  }
}

const mapStateToProps = state => ({
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
  isFetchingPlipsNextPageFavoritePlips: isFetchingPlipsNextPageFavoritePlips(state),
  isFetchingPlipsNextPageNationwidePlips: isFetchingPlipsNextPageNationwidePlips(state),
  isFetchingPlipsNextPagePlipsByLocation: isFetchingPlipsNextPagePlipsByLocation(state),
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
  isRefreshingNationwidePlips: isRefreshingNationwidePlips (state),
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
});

const mapDispatchToProps = dispatch => ({
  onAvatarChanged: avatar => dispatch(profileSaveAvatar({ avatar, shouldNavigate: false })),
  onRetryPlips: () => dispatch(fetchPlips()),
  onFetchPlipsNextPage: ({ typeList, nextPage }) => dispatch(fetchPlipsNextPage({ typeList, nextPage })),
  onFetchProfile: () => dispatch(fetchProfile()),
  onFirstTimeModalClose: () => dispatch(userFirstTimeDone()),
  onGoToPlip: plip => {
    dispatch(navigate("showPlip"));
    dispatch(setCurrentPlip(plip));
  },
  onLogEvent: ({ name, extraData }) => dispatch(logEvent({ name, extraData })),
  onLogout: () => dispatch(logout()),
  onOpenURL: url => dispatch(openURL(url)),
  onProfileEdit: () => dispatch(navigate("profileUpdate")),
  onRefresh: ({ typeList }) => dispatch(refreshPlips({ typeList })),
  onSignIn: () => dispatch(navigate("signIn")),
  onTapAboutApp: () => dispatch(navigate("aboutApp")),
  onMainTabChange: ({ index }) => dispatch(updateMainTabViewIndex(index)),
  onTellAFriend: () => dispatch(tellAFriend()),
  onValidateProfile: () => dispatch(validateProfile()),
  onClearSearch: () => dispatch(clearSearchPlip()),
  onSearchPlip: title => dispatch(searchPlip(title)),
  onShare: plip => dispatch(sharePlip(plip)),
  onToggleFavorite: detailId => dispatch(toggleFavorite({ detailId })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
