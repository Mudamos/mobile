import { connect } from "react-redux";

import ProfileVoteAddressLayout from "../components/profile-vote-address-layout";

import {
  navigate,
  openURL,
  saveVoteAddress,
} from "../actions";

import {
  getTseVoteAddress,
  isSavingProfile,
} from "../selectors";

const mapStateToProps = state => ({
  isSaving: isSavingProfile(state),
  tseVoteAddress: getTseVoteAddress(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onOpenURL: url => dispatch(openURL(url)),
  onSave: ({ city, state }) => dispatch(saveVoteAddress({ city, state })),
});

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ProfileVoteAddressLayout);
