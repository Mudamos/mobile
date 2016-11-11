import { connect } from "react-redux";

import { fetchPlips } from "../actions";
import { findCurrentPlip } from "../selectors";

import PlipLayout from "../components/plip-layout";

const mapStateToProps = state => ({
  plip: findCurrentPlip(state)
});
const mapDispatchToProps = dispatch => ({
  retryPlip: () => dispatch(fetchPlips())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlipLayout);
