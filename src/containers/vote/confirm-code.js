import { connect } from "react-redux";

import ConfirmVoteCodeLayout from "../../components/vote/confirm-vote-code-layout";

import {
  navigateBack,
  sendVoteCodeConfirmation,
  voteCodeConfirmationDismiss,
} from "../../actions";

import {
  isSendingVoteCodeConfirmation,
} from "../../selectors";

const mapStateToProps = state => ({
  isSaving: isSendingVoteCodeConfirmation(state),
});

const mapDispatchToProps = (dispatch, { goBackToScreenKey, phone, plip }) => ({
  onBack: () => dispatch(navigateBack()),
  onSave: ({ pinCode }) => dispatch(sendVoteCodeConfirmation({ goBackToScreenKey, phone, pinCode, plip })),
  onSkip: () => dispatch(voteCodeConfirmationDismiss({ goBackToScreenKey })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVoteCodeLayout);
