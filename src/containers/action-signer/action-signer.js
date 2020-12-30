import { connect } from "react-redux";

import ActionSignerLayout from "../../components/action-signer/action-signer";

import { actionSignerResult, isActionSignerDone } from "../../selectors";

const mapStateToProps = (state) => {
  const result = actionSignerResult(state);

  return {
    done: isActionSignerDone(state),
    error: result.error,
    errorIdentifier: result.error ? result.message : null,
  };
};

export default connect(mapStateToProps)(ActionSignerLayout);
