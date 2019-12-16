import { connect } from "react-redux";

import ConfirmVoteLayout from "../../components/vote/confirm-vote-layout";

import {
  sendVotePhoneConfirmation,
} from "../../actions";

import {
  isSendingVoteConfirmation,
} from "../../selectors";

const mapStateToProps = state => ({
  isSaving: isSendingVoteConfirmation(state),
});

const mapDispatchToProps = (dispatch, { goBackToScreenKey, plip }) => ({
  onSave: ({ phone }) => dispatch(sendVotePhoneConfirmation({ goBackToScreenKey, phone, plip })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmVoteLayout);
