import React, { Component, PropTypes } from "react";
import { Alert, View } from "react-native";
import { connect } from "react-redux";

import {
  prop,
  sortBy,
} from "ramda";

import { isDev, moment } from "../utils";

import locale from "../locales/pt-BR";

import {
  fetchProfile,
  fetchPlips,
  logout,
  navigate,
  openURL,
  removeJustSignedPlip,
  sharePlip,
  signPlip,
  userFirstTimeDone,
} from "../actions";

import {
  errorFetchingPlips,
  currentUser as getCurrentUser,
  isFetchingPlips,
  isFetchingProfile,
  isSigningPlip,
  isUserFirstTime,
  isUserLoggedIn,
  findCurrentPlip,
  getPlipSignInfo,
  getUserCurrentPlipSignInfo,
  hasUserJustSignedPlip,
} from "../selectors";

import PlipLayout from "../components/plip-layout";
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
  };

  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isSigning: PropTypes.bool,
    isUserFirstTime: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    userSignDate: PropTypes.object,
    onChangePassword: PropTypes.func.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onFirstTimeModalClose: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onPlipsFetch: PropTypes.func.isRequired,
    onProfileEdit: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
    onSignUp: PropTypes.func.isRequired,
    onViewPlip: PropTypes.func.isRequired,
  };

  get menuEntries() {
    const {
      currentUser,
      isFetchingProfile,
      onChangePassword,
      onProfileEdit,
    } = this.props;

    const entries = [
      { icon: "info", title: locale.menu.about, action: this.onAbout.bind(this), position: 2 },
    ];

    if (!isFetchingProfile && currentUser) {
      entries.push({ icon: "account-circle", title: locale.menu.editProfile, action: onProfileEdit, position: 0 });
      entries.push({ icon: "lock", title: locale.menu.changePassword, action: onChangePassword, position: 1 });
    }

    if (!currentUser) {
      entries.push({ icon: "person", title: locale.getIn, action: this.onSignUp.bind(this), position: 0});
    }

    return sortMenuEntries(entries);
  }

  componentWillMount() {
    if (isDev) Toast.show("Plip componentWillMount");
    this.props.onPlipsFetch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUserFirstTime === true && !this.state.showAboutModal) {
      this.setState({ showAboutModal: true });
    }
  }

  render() {
    const { menuOpen: open } = this.state;

    return (
      <Menu
        open={open}
        content={this.renderMenuContent()}
        onClose={() => this.setState({ menuOpen: false })}
      >
        {this.renderPage()}
      </Menu>
    );
  }

  renderPage() {
    const { showAboutModal } = this.state;

    return (
      <View style={{flex: 1}}>
        <PlipLayout
          {...this.props}
          openMenu={this.openMenu.bind(this)}
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

  renderMenuContent() {
    const {
      currentUser,
      isFetchingProfile,
      onLogout,
    } = this.props;

    return (
      <LoggedInMenu
        currentUser={currentUser}
        isFetchingProfile={isFetchingProfile}
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
}

const onPlipSign = ({ dispatch, plip }) => {
  Alert.alert(
    null,
    `${locale.doYouWantToSign} "${plip.phase.name}"?`,
    [
      {text: locale.cancel, onPress: () => {}, style: "cancel"},
      {text: locale.yes, onPress: () => dispatch(signPlip({ plip }))},
    ]
  )
};

const mapStateToProps = state => {
  const userSignInfo = getUserCurrentPlipSignInfo(state);
  let plipSignInfo = getPlipSignInfo(state);

  if (plipSignInfo) {
    plipSignInfo = {
      ...plipSignInfo,
      updatedAt: plipSignInfo.updatedAt ? moment(plipSignInfo.updatedAt) : null,
    };
  }

  return {
    currentUser: getCurrentUser(state),
    errorFetchingPlips: errorFetchingPlips(state),
    isFetchingPlip: isFetchingPlips(state),
    isFetchingProfile: isFetchingProfile(state),
    isSigning: isSigningPlip(state),
    isUserFirstTime: isUserFirstTime(state),
    isUserLoggedIn: isUserLoggedIn(state),
    plip: findCurrentPlip(state),
    justSignedPlip: hasUserJustSignedPlip(state),
    plipSignInfo: plipSignInfo,
    userSignDate: userSignInfo && userSignInfo.updatedAt && moment(userSignInfo.updatedAt),
  };
}

const mapDispatchToProps = dispatch => ({
  retryPlip: () => dispatch(fetchPlips()),
  onChangePassword: () => dispatch(navigate("changePassword")),
  onFetchProfile: () => dispatch(fetchProfile()),
  onFirstTimeModalClose: () => dispatch(userFirstTimeDone()),
  onLogout: () => dispatch(logout()),
  onOpenURL: url => dispatch(openURL(url)),
  onPlipsFetch: () => dispatch(fetchPlips()),
  onPlipSign: plip => onPlipSign({ dispatch, plip }),
  onProfileEdit: () => dispatch(navigate("profileUpdate")),
  onShare: plip => dispatch(sharePlip(plip)),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
  onSignUp: () => dispatch(navigate("signUp")),
  onViewPlip: plip => dispatch(navigate("plipViewer", { plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
