import { connect } from "react-redux";

import ProfileConcludeLayout from "../components/profile-conclude-layout";

import {
  currentUser as getCurrentUser,
  findPlipsSignInfo,
  getUserSignInfo,
  isSavingProfile,
  mostRecentNationalPlip,
} from "../selectors";

import {
  navigate,
  openURL,
  setCurrentPlip,
  sharePlip,
} from "../actions";

const mapStateToProps = state => ({
  isSaving: isSavingProfile(state),
  currentUser: getCurrentUser(state),
  plipsSignInfo: findPlipsSignInfo(state),
  userSignInfo: getUserSignInfo(state),
  plip: mostRecentNationalPlip(state),
});

const mapDispatchToProps = dispatch => ({
  onBack: () =>  dispatch(navigate("plipsNav")),
  onOpenURL: url => dispatch(openURL(url)),
  onGoToPlip: plip => {
    dispatch(navigate("showPlip"));
    dispatch(setCurrentPlip(plip));
  },
  onShare: plip => dispatch(sharePlip(plip)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConcludeLayout);
