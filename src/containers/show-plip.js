import { connect } from "react-redux";

import { fetchPlip } from "../actions";

import PlipLayout from "../components/plip-layout";

const mapStateToProps = state => ({ plip: state.plips.plip });
const mapDispatchToProps = dispatch => ({
  signPlip: () => dispatch(fetchPlip())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlipLayout);
