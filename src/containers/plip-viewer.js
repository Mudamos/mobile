import { Alert } from "react-native";
import { connect } from "react-redux";

import { moment } from "../utils";

import locale from "../locales/pt-BR";

import {
  navigateBack,
  removeJustSignedPlip,
  sharePlip,
  signPlip,
} from "../actions";

import {
  isSigningPlip,
  getUserCurrentPlipSignInfo,
  hasUserJustSignedPlip,
} from "../selectors";

import PlipViewerLayout from "../components/plip-viewer-layout";

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

  return {
    isSigning: isSigningPlip(state),
    justSignedPlip: hasUserJustSignedPlip(state),
    userSignDate: userSignInfo && userSignInfo.updatedAt && moment(userSignInfo.updatedAt),
  };
}

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onPlipSign: plip => onPlipSign({ dispatch, plip }),
  onShare: plip => dispatch(sharePlip(plip)),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlipViewerLayout);
