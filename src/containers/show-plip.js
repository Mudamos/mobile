import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { moment } from "../utils";

import {
  clearPlipInfo,
  fetchPlipRelatedInfo,
  handleAppLink,
  navigate,
  openURL,
  removeJustSignedPlip,
  sharePlip,
  signPlip,
  toggleFavorite,
} from "../actions";

import {
  currentUser,
  getCurrentPlip,
  fetchPlipRelatedInfoError,
  findPlipsFavoriteInfo,
  isAddingFavoritePlip,
  isFetchingPlipRelatedInfo,
  isRemainingDaysEnabled,
  isSigningPlip,
  getCurrentPlipShortSignersInfo,
  getPlipSignInfo,
  getUserCurrentPlipSignInfo,
  handlingAppLinkError,
  hasUserJustSignedPlip,
  listRemoteConfig,
} from "../selectors";

import PlipLayout from "../components/plip-layout";


class Container extends Component {
  static propTypes = {
    errorFetching: PropTypes.bool,
    errorHandlingAppLink: PropTypes.bool,
    isAddingFavoritePlip: PropTypes.bool,
    isFetchingPlipRelatedInfo: PropTypes.bool,
    isSigning: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object,
    plipSignInfo: PropTypes.object,
    plipsFavoriteInfo: PropTypes.object,
    signers: PropTypes.array,
    signersTotal: PropTypes.number,
    userSignDate: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onFetchPlipRelatedInfo: PropTypes.func.isRequired,
    onOpenSigners: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onRetryAppLink: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
    onToggleFavorite: PropTypes.func.isRequired,
    onViewPlip: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { plip, onFetchPlipRelatedInfo } = this.props;
    if (nextProps.plip && (plip == null || plip.id !== nextProps.plip.id)) {
      onFetchPlipRelatedInfo(nextProps.plip.id);
    }
  }

  render() {
    return (
      <PlipLayout
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  const currentPlip = getCurrentPlip(state);
  const plipId = currentPlip ? currentPlip.id : null;
  const userSignInfo = getUserCurrentPlipSignInfo(state, plipId);
  let plipSignInfo = getPlipSignInfo(plipId)(state);

  if (plipSignInfo) {
    plipSignInfo = {
      ...plipSignInfo,
      updatedAt: plipSignInfo.updatedAt ? moment(plipSignInfo.updatedAt) : null,
    };
  }

  const currentPlipShortSignersInfo = getCurrentPlipShortSignersInfo(state);

  return {
    plip: getCurrentPlip(state),
    errorFetching: fetchPlipRelatedInfoError(state),
    errorHandlingAppLink: handlingAppLinkError(state),
    isAddingFavoritePlip: isAddingFavoritePlip(state),
    isFetchingPlipRelatedInfo: isFetchingPlipRelatedInfo(state),
    isRemainingDaysEnabled: isRemainingDaysEnabled(state),
    isSigning: isSigningPlip(state),
    justSignedPlip: plipId ? hasUserJustSignedPlip(state, plipId) : false,
    plipsFavoriteInfo: findPlipsFavoriteInfo(state),
    plipSignInfo: plipSignInfo,
    remoteConfig: listRemoteConfig(state),
    signers: currentPlipShortSignersInfo.users,
    signersTotal: currentPlipShortSignersInfo.total,
    user: currentUser(state),
    userSignDate: userSignInfo && userSignInfo.updatedAt && moment(userSignInfo.updatedAt),
  };
}

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearPlipInfo());
    dispatch(navigate("plipsNav"));
  },
  onFetchPlipRelatedInfo: plipId => dispatch(fetchPlipRelatedInfo(plipId)),
  onOpenSigners: plipId => dispatch(navigate("signers", { plipId })),
  onOpenURL: url => dispatch(openURL(url)),
  onLogin: () => dispatch(navigate("signIn")),
  onPlipSign: plip => dispatch(signPlip({ plip })),
  onRetryAppLink: () => dispatch(handleAppLink()),
  onShare: plip => dispatch(sharePlip(plip)),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
  onToggleFavorite: detailId => dispatch(toggleFavorite({ detailId })),
  onViewPlip: plip => dispatch(navigate("plipViewer", { plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
