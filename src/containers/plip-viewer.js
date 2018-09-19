import { Alert } from "react-native";
import { connect } from "react-redux";

import { moment } from "../utils";

import locale from "../locales/pt-BR";

import {
  navigate,
  navigateBack,
  removeJustSignedPlip,
  sharePlip,
  signPlip,
} from "../actions";

import {
  currentUser,
  isSigningPlip,
  getUserCurrentPlipSignInfo,
  hasUserJustSignedPlip,
} from "../selectors";

import PlipViewerLayout from "../components/plip-viewer-layout";

const mapStateToProps = (state, ownProps) => {
  const userSignInfo = getUserCurrentPlipSignInfo(state, ownProps.plip.id);

  return {
    user: currentUser(state),
    isSigning: isSigningPlip(state),
    justSignedPlip: hasUserJustSignedPlip(state, ownProps.plip.id),
    userSignDate: userSignInfo && userSignInfo.updatedAt && moment(userSignInfo.updatedAt),
  };
}

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onPlipSign: plip => dispatch(signPlip({ plip })),
  onLogin: () => dispatch(navigate("signIn")),
  onShare: plip => dispatch(sharePlip(plip)),
  onSignSuccessClose: plip => dispatch(removeJustSignedPlip({ plipId: plip.id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlipViewerLayout);
