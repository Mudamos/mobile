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
  setCurrentPlip,
} from "../actions";

import {
  isAppReady,
  isFetchingPlips,
  isFetchingPlipsNextPage,
  isRefreshingPlips,
  errorFetchingPlips,
  currentUser as getCurrentUser,
  getMainTabView,
  getUserSignInfo,
  hasPlipsNextPage,
  isFetchingProfile,
  isUserFirstTime,
  isUserLoggedIn,
  findPlips,
  findNationwidePlips,
  findUserLocationPlips,
  findUserFavoritePlips,
  findAllPlips,
  findSignedPlips,
  findRemoteLinks,
  findPlipsSignInfo,
  getCurrentSigningPlip,
  getPlipsSignatureGoals,
  isValidatingProfile,
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
    currentSigningPlip: PropTypes.object,
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isAppReady: PropTypes.bool,
    isFetchingPlips: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    isValidatingProfile: PropTypes.bool,
    nationwidePlips: PropTypes.array,
    userLocationPlips: PropTypes.array,
    allPlips: PropTypes.array,
    signedPlips: PropTypes.array,
    remoteLinks: RemoteLinksType,
    onAvatarChanged: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
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
    onValidateProfile: PropTypes.func.isRequired,
  };

  get menuEntries() {
    const {
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      remoteLinks,
      onChangePassword,
      onProfileEdit,
      onValidateProfile,
    } = this.props;

    const entries = [
      { icon: "bubble-chart", title: locale.menu.about, action: this.onAbout, position: 2 },
      { icon: "account-balance", title: locale.links.sendYourPL, action: () => this.onOpenURL({ eventName: "tapped_menu_send_your_pl", link: remoteLinks.sendYourIdea }), position: 3 },
      { icon: "extension", title: locale.links.getToKnowMudamos, action: () => this.onOpenURL({ eventName: "tapped_menu_get_to_know_mudamos", link: remoteLinks.getToKnowMudamos }), position: 4 },
      { icon: "help", title: locale.links.help, action: () => this.onOpenURL({ eventName: "tapped_menu_help", link: remoteLinks.help }), position: 5 },
      { icon: "favorite", title: locale.menu.tellAFriend, action: this.onTellAFriend, position: 6 },
    ];

    if (!isFetchingProfile && currentUser) {
      entries.push({ icon: "verified-user", title: locale.menu.validateProfile, action: onValidateProfile, position: -1 });
      entries.push({ icon: "account-circle", title: locale.menu.editProfile, action: onProfileEdit, position: 0 });

      if (currentUser.isAppUser) {
        entries.push({ icon: "lock", title: locale.menu.changePassword, action: onChangePassword, position: 1 });
      }
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
    const { onLogEvent } = this.props;
    this.closeMenu();
    this.setState({ showAboutModal: true });
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
  errorFetchingPlips: errorFetchingPlips(state),
  hasNextPage: hasPlipsNextPage(state),
  isAppReady: isAppReady(state),
  isFetchingPlips: isFetchingPlips(state),
  isFetchingPlipsNextPage: isFetchingPlipsNextPage(state),
  isFetchingProfile: isFetchingProfile(state),
  isRefreshingPlips: isRefreshingPlips(state),
  isUserFirstTime: isUserFirstTime(state),
  isUserLoggedIn: isUserLoggedIn(state),
  isValidatingProfile: isValidatingProfile(state),
  nationwidePlips: findNationwidePlips(state),
  userLocationPlips: findUserLocationPlips(state),
  favoritePlips: findUserFavoritePlips(state),
  allPlips: findAllPlips(state),
  signedPlips: findSignedPlips(state),
  remoteLinks: findRemoteLinks(state),
  plipsSignInfo: findPlipsSignInfo(state),
  signatureGoals: getPlipsSignatureGoals(state),
  tabViewState: getMainTabView(state),
  userSignInfo: getUserSignInfo(state),
});

const mapDispatchToProps = dispatch => ({
  onAvatarChanged: avatar => dispatch(profileSaveAvatar({ avatar, shouldNavigate: false })),
  onRetryPlips: () => dispatch(fetchPlips()),
  onChangePassword: () => dispatch(navigate("changePassword")),
  onFetchPlipsNextPage: () => dispatch(fetchPlipsNextPage()),
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
  onRefresh: () => dispatch(refreshPlips()),
  onSignIn: () => dispatch(navigate("signIn")),
  onMainTabChange: ({ index }) => dispatch(updateMainTabViewIndex(index)),
  onTellAFriend: () => dispatch(tellAFriend()),
  onValidateProfile: () => dispatch(validateProfile()),
  onShare: plip => dispatch(sharePlip(plip)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
