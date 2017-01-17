import React, { Component, PropTypes } from "react";
import { Alert } from "react-native";
import { connect } from "react-redux";

import { isDev, moment } from "../utils";

import locale from "../locales/pt-BR";

import {
  fetchProfile,
  fetchPlips,
  logout,
  navigate,
  openURL,
  removeJustSignedPlip,
  signPlip,
} from "../actions";

import {
  errorFetchingPlips,
  currentUser as getCurrentUser,
  isFetchingPlips,
  isFetchingProfile,
  isSigningPlip,
  isUserLoggedIn,
  findCurrentPlip,
  getPlipSignInfo,
  getUserCurrentPlipSignInfo,
  hasUserJustSignedPlip,
} from "../selectors";

import PlipLayout from "../components/plip-layout";
import Menu from "../components/side-menu";
import LoggedInMenu from "../components/logged-in-menu-content";

import Toast from "react-native-simple-toast";

class Container extends Component {
  state = {
    menuOpen: false,
  };

  static propTypes = {
    currentUser: PropTypes.object,
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isFetchingProfile: PropTypes.bool,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    userSignDate: PropTypes.object,
    onChangePassword: PropTypes.func.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onPlipsFetch: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
    onViewPlip: PropTypes.func.isRequired,
  };

  get menuEntries() {
    const {
      onChangePassword,
    } = this.props;

    return [
      { icon: "account-circle", title: locale.menu.editProfile, action: () => {} },
      { icon: "lock", title: locale.menu.changePassword, action: onChangePassword },
    ];
  }

  componentWillMount() {
    if (isDev) Toast.show("Plip componentWillMount");
    this.props.onPlipsFetch();
  }

  render() {
    const { isUserLoggedIn } = this.props;

    return isUserLoggedIn ? this.renderWithMenu() : this.renderPage();
  }

  renderWithMenu() {
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
    return (
      <PlipLayout
        {...this.props}
        openMenu={this.openMenu.bind(this)}
      />
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
  onLogout: () => dispatch(logout()),
  onOpenURL: url => dispatch(openURL(url)),
  onPlipsFetch: () => dispatch(fetchPlips()),
  onPlipSign: plip => onPlipSign({ dispatch, plip }),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
  onViewPlip: plip => dispatch(navigate("plipViewer", { plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
