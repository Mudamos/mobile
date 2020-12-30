import { connect } from "react-redux";

import { navigateBack } from "../actions";
import { privacyPolicyURL } from "../selectors";

import Layout from "../components/privacy-policy-layout";

const mapStateToProps = (state) => ({
  source: {
    uri: privacyPolicyURL(state),
  },
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigateBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
