import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
  ListView,
  View,
} from "react-native";

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
  logout,
  navigate,
  refreshPlips,
  userFirstTimeDone,
} from "../actions";

import {
  isAppReady,
  errorFetchingPlips,
  currentUser as getCurrentUser,
  isFetchingPlips,
  isFetchingNextPlipsPage,
  isFetchingProfile,
  isRefreshingPlips,
  isUserFirstTime,
  isUserLoggedIn,
  findPlips,
  getCurrentPlipsPage,
  getNextPlipsPage,
  getCurrentSigningPlip,
} from "../selectors";

import PlipsLayout from "../components/plips-layout";
import SplashLoader from "../components/splash-loader";
import Menu from "../components/side-menu";
import LoggedInMenu from "../components/logged-in-menu-content";
import SimpleModal from "../components/simple-modal";
import MarkdownView from "../containers/markdown-view";

import Toast from "react-native-simple-toast";
import aboutHtmlStyles from "../styles/about-html-styles";


const sortMenuEntries = entries => sortBy(prop("position"), entries);


class Container extends Component {
  state = {
    menuOpen: false,
    showAboutModal: false,

    plipsDataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows(this.props.plips || []),
  };

  static propTypes = {
    currentPage: PropTypes.number,
    currentSigningPlip: PropTypes.object,
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isAppReady: PropTypes.bool,
    isFetchingNextPlipsPage: PropTypes.bool,
    isFetchingPlips: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    nextPage: PropTypes.number,
    plips: PropTypes.array,
    onChangePassword: PropTypes.func.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onFirstTimeModalClose: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onPlipsFetch: PropTypes.func.isRequired,
    onProfileEdit: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onRetryPlips: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
  };

  get menuEntries() {
    const {
      currentUser,
      isFetchingProfile,
      isUserLoggedIn,
      onChangePassword,
      onProfileEdit,
    } = this.props;

    const entries = [
      { icon: "info", title: locale.menu.about, action: this.onAbout.bind(this), position: 2 },
    ];

    if (!isFetchingProfile && currentUser) {
      entries.push({ icon: "account-circle", title: locale.menu.editProfile, action: onProfileEdit, position: 0 });

      if (currentUser.isAppUser) {
        entries.push({ icon: "lock", title: locale.menu.changePassword, action: onChangePassword, position: 1 });
      }
    }

    if (!isFetchingProfile && !currentUser && !isUserLoggedIn) {
      entries.push({ icon: "person", title: locale.getIn, action: this.onSignUp.bind(this), position: 0});
    }

    return sortMenuEntries(entries);
  }

  componentWillMount() {
    const {
      plips,
      onPlipsFetch,
    } = this.props;

    if (isDev) Toast.show("PlipsList componentWillMount");

    if (!plips || !plips.length) {
      onPlipsFetch();
    }
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

    this.setState({
      plipsDataSource: this.state.plipsDataSource.cloneWithRows(nextProps.plips || []),
    });
  }

  render() {
    const { onFetchProfile } = this.props;
    const { menuOpen: open } = this.state;

    return (
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
    );
  }

  renderPage() {
    const {
      plipsDataSource,
      showAboutModal,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <PlipsLayout
          {...this.props}

          openMenu={this.openMenu.bind(this)}
          plipsDataSource={plipsDataSource}
          onFetchPlips={this.onFetchPlipsNextPage.bind(this)}
        />

        {
          showAboutModal &&
            <SimpleModal
              onClose={this.onFirstTimeModalClose.bind(this)}
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
      onLogout,
    } = this.props;

    return (
      <LoggedInMenu
        currentUser={currentUser}
        isFetchingProfile={isFetchingProfile}
        isUserLoggedIn={isUserLoggedIn}
        onLogout={onLogout}

        menuEntries={this.menuEntries}
      />
    );
  }

  openMenu() {
    const { onFetchProfile } = this.props;

    this.setState({ menuOpen: true });
    onFetchProfile();
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  onAbout() {
    this.closeMenu();
    this.setState({ showAboutModal: true });
  }

  onFirstTimeModalClose() {
    const { onFirstTimeModalClose } = this.props;

    onFirstTimeModalClose();
    this.setState({ showAboutModal: false });
  }

  onSignUp() {
    const { onSignUp } = this.props;

    onSignUp();
    this.closeMenu();
  }

  onFetchPlipsNextPage() {
    const {
      isFetchingPlips,
      isFetchingNextPlipsPage,
      isRefreshing,
      nextPage,
      onFetchPlipsNextPage,
    } = this.props;

    if (nextPage && !isFetchingNextPlipsPage && !isFetchingPlips && !isRefreshing) {
      onFetchPlipsNextPage({ page: nextPage });
    }
  }
}

const mapStateToProps = state => {
  return {
    currentPage: getCurrentPlipsPage(state),
    currentSigningPlip: getCurrentSigningPlip(state),
    currentUser: getCurrentUser(state),
    errorFetchingPlips: errorFetchingPlips(state),
    isAppReady: isAppReady(state),
    isFetchingPlips: isFetchingPlips(state),
    isFetchingNextPlipsPage: isFetchingNextPlipsPage(state),
    isFetchingProfile: isFetchingProfile(state),
    isRefreshing: isRefreshingPlips(state),
    isUserFirstTime: isUserFirstTime(state),
    isUserLoggedIn: isUserLoggedIn(state),
    plips: findPlips(state),
    nextPage: getNextPlipsPage(state),
  };
}

const mapDispatchToProps = dispatch => ({
  onRetryPlips: () => dispatch(fetchPlips()),
  onChangePassword: () => dispatch(navigate("changePassword")),
  onFetchPlipsNextPage: ({ page }) => dispatch(fetchPlipsNextPage({ page })),
  onFetchProfile: () => dispatch(fetchProfile()),
  onFirstTimeModalClose: () => dispatch(userFirstTimeDone()),
  onGoToPlip: plip => dispatch(navigate("showPlip", { plip })),
  onLogout: () => dispatch(logout()),
  onPlipsFetch: () => dispatch(fetchPlips()),
  onProfileEdit: () => dispatch(navigate("profileUpdate")),
  onRefresh: () => dispatch(refreshPlips()),
  onSignUp: () => dispatch(navigate("signUp")),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
