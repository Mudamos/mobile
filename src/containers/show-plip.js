import { connect } from "react-redux";

import PlipLayout from "../components/plip-layout";

const mapStateToProps = state => ({ plip: state.plips.plip });
const mapDispatchToProps = dispatch => ({ dispatch }); // This is the default, no need to

export default connect(mapStateToProps, mapDispatchToProps)(PlipLayout);
