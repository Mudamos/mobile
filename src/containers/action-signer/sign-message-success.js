import { connect } from "react-redux";

import Layout from "../../components/action-signer/message-sign-success-layout";
import { navigateBack } from "../../actions";

const mapDispatchToProps = (dispatch) => ({
  onFinish: () => dispatch(navigateBack()),
});

export default connect(null, mapDispatchToProps)(Layout);
