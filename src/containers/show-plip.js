import { connect } from "react-redux";

import {
  fetchPlips,
  logout,
  signPlip,
} from "../actions";
import {
  findCurrentPlip,
  isFetchingPlips,
  isSigningPlip,
  isUserLoggedIn,
  errorFetchingPlips,
} from "../selectors";

import PlipLayout from "../components/plip-layout";

const mapStateToProps = state => ({
  plip: findCurrentPlip(state),
  isFetchingPlip: isFetchingPlips(state),
  isSigning: isSigningPlip(state),
  isUserLoggedIn: isUserLoggedIn(state),
  errorFetchingPlips: errorFetchingPlips(state),
});

const mapDispatchToProps = dispatch => ({
  retryPlip: () => dispatch(fetchPlips()),
  onLogout: () => dispatch(logout()),
  onPlipSign: () => dispatch(signPlip()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlipLayout);
