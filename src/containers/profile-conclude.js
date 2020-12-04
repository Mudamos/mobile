import { connect } from "react-redux";

import ProfileConcludeLayout from "../components/profile-conclude-layout";

import {
  currentUser as getCurrentUser,
  findPlipsFavoriteInfo,
  findPlipsSignInfo,
  getUserSignInfo,
  isAddingFavoritePlip,
  isSavingProfile,
  mostRecentNationalPlip,
} from "../selectors";

import {
  navigate,
  openURL,
  signingUp,
  setCurrentPlip,
  sharePlip,
  toggleFavorite,
} from "../actions";

const mapStateToProps = (state) => ({
  isAddingFavoritePlip: isAddingFavoritePlip(state),
  isSaving: isSavingProfile(state),
  currentUser: getCurrentUser(state),
  plipsFavoriteInfo: findPlipsFavoriteInfo(state),
  plipsSignInfo: findPlipsSignInfo(state),
  userSignInfo: getUserSignInfo(state),
  plip: mostRecentNationalPlip(state),
});

const mapDispatchToProps = (dispatch) => ({
  onBack: () => dispatch(navigate("plipsNav")),
  onConcludeSignUp: () => dispatch(signingUp(false)),
  onOpenURL: (url) => dispatch(openURL(url)),
  onGoToPlip: (plip) => {
    dispatch(navigate("showPlip"));
    dispatch(setCurrentPlip(plip));
  },
  onShare: (plip) => dispatch(sharePlip(plip)),
  onToggleFavorite: (detailId) => dispatch(toggleFavorite({ detailId })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileConcludeLayout);
