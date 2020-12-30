import { connect } from "react-redux";

import ConfirmVoteCodeLayout from "../../components/vote/confirm-vote-code-layout";

import { navigateBack, sendVoteCodeConfirmation } from "../../actions";

import { isSendingVoteCodeConfirmation } from "../../selectors";

const mapStateToProps = (state) => ({
  isSaving: isSendingVoteCodeConfirmation(state),
});

const mapDispatchToProps = (dispatch, { goBackToScreenKey, phone, plip }) => ({
  onBack: () => dispatch(navigateBack()),
  onSave: ({ pinCode }) =>
    dispatch(
      sendVoteCodeConfirmation({ goBackToScreenKey, phone, pinCode, plip }),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmVoteCodeLayout);
