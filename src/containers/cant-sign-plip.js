import { connect } from "react-redux";

import CantSignPlipLayout from "../components/cant-sign-plip-layout";

import {
  getCurrentPlip,
} from "../selectors";

import {
  clearPlipInfo,
  navigate,
  navigateBack,
  sharePlip,
  updateMainTabViewIndex,
} from "../actions";

import { getMainTabViewIndexByKey } from "./../models/main-tab-view";

const userLocationPlipsKey = getMainTabViewIndexByKey("userLocationPlips");

const mapStateToProps = state => ({
  plip: getCurrentPlip(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
  onMyLocation: () => {
    dispatch(clearPlipInfo());
    dispatch(updateMainTabViewIndex(userLocationPlipsKey));
    dispatch(navigate("plipsNav"));
  },
  onShare: plip => dispatch(sharePlip(plip)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CantSignPlipLayout);
