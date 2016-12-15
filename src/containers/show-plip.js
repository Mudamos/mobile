import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { moment } from "../utils";

import {
  fetchPlips,
  logout,
  signPlip,
} from "../actions";
import {
  findCurrentPlip,
  getUserCurrentPlipSignInfo,
  isFetchingPlips,
  isSigningPlip,
  isUserLoggedIn,
  errorFetchingPlips,
} from "../selectors";

import PlipLayout from "../components/plip-layout";

class Container extends Component {
  static propTypes = {
    errorFetchingPlips: PropTypes.bool,
    isFetchingPlip: PropTypes.bool.isRequired,
    isSigning: PropTypes.bool,
    isUserLoggedIn: PropTypes.bool,
    navigationState: PropTypes.object.isRequired,
    plip: PropTypes.object,
    plipSignDate: PropTypes.object,
    retryPlip: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onPlipsFetch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.props.onPlipsFetch();
  }

  render() {
    return (
      <PlipLayout {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  const signInfo = getUserCurrentPlipSignInfo(state);

  return {
    plipSignDate: signInfo && moment(signInfo.dateTime),
    plip: findCurrentPlip(state),
    isFetchingPlip: isFetchingPlips(state),
    isSigning: isSigningPlip(state),
    isUserLoggedIn: isUserLoggedIn(state),
    errorFetchingPlips: errorFetchingPlips(state),
  };
}

const mapDispatchToProps = dispatch => ({
  retryPlip: () => dispatch(fetchPlips()),
  onLogout: () => dispatch(logout()),
  onPlipsFetch: () => dispatch(fetchPlips()),
  onPlipSign: plip => dispatch(signPlip({ plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
