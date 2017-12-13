import { connect } from "react-redux";

import ActionSignerLayout from "../../components/sign-action/action-signer";

const close = () => ({
  type: "SIGNER_CLOSE_APP",
});

const mapStateToProps = state => ({
  hasError: state.signApp.error.hasError,
  errorMessage: state.signApp.error.message,
  result: state.signApp.result.message,
});

const mapDispatchToProps = {
  onCloseSignActionApp: close,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionSignerLayout);
