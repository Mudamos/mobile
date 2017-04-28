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

import { isDev, MUDAMOS_WEB_SITE } from "../utils";

import locale from "../locales/pt-BR";

import {
  changePlipsFilterScope,
  fetchProfile,
  fetchFilteredPlips,
  fetchFilteredPlipsNextPage,
  logout,
  navigate,
  openURL,
  profileSaveAvatar,
  refreshFilteredPlips,
  userFirstTimeDone,
} from "../actions";

import {
  isAppReady,
  errorFetchingNationwidePlips,
  errorFetchingStatewidePlips,
  errorFetchingCitywidePlips,
  currentUser as getCurrentUser,
  getPlipsFilters,
  isFetchingNationwidePlips,
  isFetchingStatewidePlips,
  isFetchingCitywidePlips,
  isFetchingProfile,
  isRefreshingNationwidePlips,
  isRefreshingStatewidePlips,
  isRefreshingCitywidePlips,
  isUserFirstTime,
  isUserLoggedIn,
  findNationwidePlips,
  findStatewidePlips,
  findCitywidePlips,
  findPlipsSignInfo,
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

    nationwidePlipsDataSource: this.cloneRows({ dataSource: this.dataSource(), plips: this.props.nationwidePlips }),
    statewidePlipsDataSource: this.cloneRows({ dataSource: this.dataSource(), plips: this.props.statewidePlips }),
    citywidePlipsDataSource: this.cloneRows({ dataSource: this.dataSource(), plips: this.props.citywidePlips }),
  };

  static propTypes = {
    citywidePlips: PropTypes.array,
    currentSigningPlip: PropTypes.object,
    currentUser: PropTypes.object,
    errorFetchingNationwidePlips: PropTypes.bool,
    isAppReady: PropTypes.bool,
    isFetchingNationwidePlips: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isRefreshingNationwide: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    nationwidePlips: PropTypes.array,
    statewidePlips: PropTypes.array,
    onAvatarChanged: PropTypes.func.isRequired,
    onChangePassword: PropTypes.func.isRequired,
    onFetchPlipsNextPage: PropTypes.func.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onFirstTimeModalClose: PropTypes.func.isRequired,
    onGoToPlip: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
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

    const {
      nationwidePlipsDataSource,
      statewidePlipsDataSource,
      citywidePlipsDataSource,
    } = this.state;

    this.setState({
      nationwidePlipsDataSource: this.cloneRows({ dataSource: nationwidePlipsDataSource, plips: nextProps.nationwidePlips }),
      statewidePlipsDataSource: this.cloneRows({ dataSource: statewidePlipsDataSource, plips: nextProps.statewidePlips }),
      citywidePlipsDataSource: this.cloneRows({ dataSource: citywidePlipsDataSource, plips: nextProps.citywidePlips }),
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
      nationwidePlipsDataSource,
      statewidePlipsDataSource,
      citywidePlipsDataSource,
      showAboutModal,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <PlipsLayout
          {...this.props}

          openMenu={this.openMenu.bind(this)}
          nationwidePlipsDataSource={nationwidePlipsDataSource}
          statewidePlipsDataSource={statewidePlipsDataSource}
          citywidePlipsDataSource={citywidePlipsDataSource}
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

  dataSource() {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
  }

  cloneRows({ dataSource, plips }) {
    return dataSource.cloneWithRows((plips || []).map((plip, index) => [plip, index]))
  }
}

const mapStateToProps = state => {
  return {
    currentSigningPlip: getCurrentSigningPlip(state),
    currentUser: getCurrentUser(state),
    errorFetchingNationwidePlips: errorFetchingNationwidePlips(state),
    errorFetchingStatewidePlips: errorFetchingStatewidePlips(state),
    errorFetchingCitywidePlips: errorFetchingCitywidePlips(state),
    filters: getPlipsFilters(state),
    isAppReady: isAppReady(state),
    isFetchingNationwidePlips: isFetchingNationwidePlips(state),
    isFetchingStatewidePlips: isFetchingStatewidePlips(state),
    isFetchingCitywidePlips: isFetchingCitywidePlips(state),
    isFetchingProfile: isFetchingProfile(state),
    isRefreshingNationwide: isRefreshingNationwidePlips(state),
    isRefreshingStatewide: isRefreshingStatewidePlips(state),
    isRefreshingCitywide: isRefreshingCitywidePlips(state),
    isUserFirstTime: isUserFirstTime(state),
    isUserLoggedIn: isUserLoggedIn(state),
    nationwidePlips: findNationwidePlips(state),
    statewidePlips: findStatewidePlips(state),
    citywidePlips: findCitywidePlips(state),
    plipsSignInfo: findPlipsSignInfo(state),
  };
}

const mapDispatchToProps = dispatch => ({
  onAvatarChanged: avatar => dispatch(profileSaveAvatar({ avatar, shouldNavigate: false })),
  onRetryPlips: () => dispatch(fetchFilteredPlips()),
  onChangePassword: () => dispatch(navigate("changePassword")),
  onChangeScope: ({ scope }) => dispatch(changePlipsFilterScope({ scope })),
  onFetchPlipsNextPage: () => dispatch(fetchFilteredPlipsNextPage()),
  onFetchProfile: () => dispatch(fetchProfile()),
  onFirstTimeModalClose: () => dispatch(userFirstTimeDone()),
  onGoToMudamos: () => dispatch(openURL(MUDAMOS_WEB_SITE)),
  onGoToPlip: plip => dispatch(navigate("showPlip", { plip })),
  onLogout: () => dispatch(logout()),
  onOpenURL: url => dispatch(openURL(url)),
  onProfileEdit: () => dispatch(navigate("profileUpdate")),
  onRefresh: () => dispatch(refreshFilteredPlips()),
  onSignUp: () => dispatch(navigate("signUp")),
  onSelectCityFilter: () => dispatch(navigate("cityFilter")),
  onSelectStateFilter: () => dispatch(navigate("stateFilter")),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
