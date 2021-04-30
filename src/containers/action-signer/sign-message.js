import { connect } from "react-redux";

import Layout from "../../components/action-signer/message-sign-layout";
import { navigateBack } from "../../actions";
import { actionSignerIntegratorErrorMessage } from "../../selectors";

const mapStateToProps = (state) => ({
  error: actionSignerIntegratorErrorMessage(state),
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigateBack()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
