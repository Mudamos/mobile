import { connect } from "react-redux";

import { navigateBack } from "../actions";

import WebViewLayout from "../components/web-view-layout";

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigateBack()),
});


export default connect(null, mapDispatchToProps)(WebViewLayout);
