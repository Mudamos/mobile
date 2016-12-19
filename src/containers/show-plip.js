import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { isDev, moment } from "../utils";

import {
  fetchPlips,
  logout,
  signPlip,
} from "../actions";
import {
  errorFetchingPlips,
  isFetchingPlips,
  isSigningPlip,
  isUserLoggedIn,
  findCurrentPlip,
  getPlipSignInfo,
  getUserCurrentPlipSignInfo,
} from "../selectors";

import PlipLayout from "../components/plip-layout";

import Toast from "react-native-simple-toast";

class Container extends Component {
  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    navigationState: PropTypes.object.isRequired,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    userSignDate: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onPlipsFetch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (isDev) Toast.show("Plip componentWillMount");
    this.props.onPlipsFetch();
  }

  render() {
    return (
      <PlipLayout {...this.props} />
    );
  }
}

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
    errorFetchingPlips: errorFetchingPlips(state),
    isFetchingPlip: isFetchingPlips(state),
    isSigning: isSigningPlip(state),
    isUserLoggedIn: isUserLoggedIn(state),
    plip: findCurrentPlip(state),
    plipSignInfo: plipSignInfo,
    userSignDate: userSignInfo && moment(userSignInfo.dateTime),
  };
}

const mapDispatchToProps = dispatch => ({
  retryPlip: () => dispatch(fetchPlips()),
  onLogout: () => dispatch(logout()),
  onPlipsFetch: () => dispatch(fetchPlips()),
  onPlipSign: plip => dispatch(signPlip({ plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
