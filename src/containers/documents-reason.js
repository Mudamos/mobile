import { connect } from "react-redux";

import DocumentsReasonLayout from "../components/documents-reason-layout";

import { navigateBack } from "../actions";

const mapDispatchToProps = dispatch => ({
  onAcknowledge: () => dispatch(navigateBack()),
});

export default connect(null, mapDispatchToProps)(DocumentsReasonLayout);
