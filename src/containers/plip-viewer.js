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
    `${locale.doYouWantToSign} "${plip.title}"?`,
    [
      {text: locale.cancel, onPress: () => {}, style: "cancel"},
      {text: locale.yes, onPress: () => dispatch(signPlip({ plip }))},
    ]
  )
};

const mapStateToProps = (state, ownProps) => {
  const userSignInfo = getUserCurrentPlipSignInfo(state, ownProps.plip.id);

  return {
    isSigning: isSigningPlip(state),
    justSignedPlip: hasUserJustSignedPlip(state, ownProps.plip.id),
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
