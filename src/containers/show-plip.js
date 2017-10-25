import React, { Component, PropTypes } from "react";
import { Alert } from "react-native";
import { connect } from "react-redux";

import { moment } from "../utils";

import locale from "../locales/pt-BR";

import {
  clearPlipInfo,
  fetchPlipRelatedInfo,
  navigate,
  navigateBack,
  openURL,
  removeJustSignedPlip,
  sharePlip,
  signPlip,
} from "../actions";

import {
  fetchPlipRelatedInfoError,
  isFetchingPlipRelatedInfo,
  isRemainingDaysEnabled,
  isSigningPlip,
  getCurrentPlipShortSignersInfo,
  getPlipSignInfo,
  getUserCurrentPlipSignInfo,
  getPlipSignatureGoals,
  hasUserJustSignedPlip,
  listRemoteConfig,
} from "../selectors";

import PlipLayout from "../components/plip-layout";


class Container extends Component {
  static propTypes = {
    errorFetching: PropTypes.bool,
    isFetchingPlipRelatedInfo: PropTypes.bool,
    isSigning: PropTypes.bool,
    justSignedPlip: PropTypes.bool,
    plip: PropTypes.object, // Navigation injected
    plipSignInfo: PropTypes.object,
    signers: PropTypes.array,
    signersTotal: PropTypes.number,
    userSignDate: PropTypes.object,
    onBack: PropTypes.func.isRequired,
    onFetchPlipRelatedInfo: PropTypes.func.isRequired,
    onOpenSigners: PropTypes.func.isRequired,
    onOpenURL: PropTypes.func.isRequired,
    onPlipSign: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    onSignSuccessClose: PropTypes.func.isRequired,
    onViewPlip: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { plip, onFetchPlipRelatedInfo } = this.props;
    onFetchPlipRelatedInfo(plip.id);
  }

  render() {
    return (
      <PlipLayout
        {...this.props}
      />
    );
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

const mapStateToProps = (state, ownProps) => {
  const plipId = ownProps.plip.id;
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
    errorFetching: fetchPlipRelatedInfoError(state),
    isFetchingPlipRelatedInfo: isFetchingPlipRelatedInfo(state),
    isRemainingDaysEnabled: isRemainingDaysEnabled(state),
    isSigning: isSigningPlip(state),
    justSignedPlip: hasUserJustSignedPlip(state, ownProps.plip.id),
    plipSignInfo: plipSignInfo,
    remoteConfig: listRemoteConfig(state),
    signers: currentPlipShortSignersInfo.users,
    signersTotal: currentPlipShortSignersInfo.total,
    signatureGoals: getPlipSignatureGoals(plipId)(state),
    userSignDate: userSignInfo && userSignInfo.updatedAt && moment(userSignInfo.updatedAt),
  };
}

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearPlipInfo());
    dispatch(navigateBack());
  },
  onFetchPlipRelatedInfo: plipId => dispatch(fetchPlipRelatedInfo(plipId)),
  onOpenSigners: plipId => dispatch(navigate("signers", { plipId })),
  onOpenURL: url => dispatch(openURL(url)),
  onPlipSign: plip => onPlipSign({ dispatch, plip }),
  onShare: plip => dispatch(sharePlip(plip)),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
  onViewPlip: plip => dispatch(navigate("plipViewer", { plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
