import { connect } from "react-redux";

import ProfileSignUpLayout from "../components/profile-sign-up-layout";

import {
  currentUser,
  getSearchedVoteCardId,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

import {
  clearProfileSaveErrors,
  navigate,
  openURL,
  profileUpdate,
} from "../actions";

import { extractNumbers, fromISODate, toISODate, voteCardMask } from "../utils";

const mapStateToProps = (state) => {
  const user = currentUser(state);

  return {
    saveErrors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
    previousName: user ? user.name : null,
    previousBirthdate:
      user && user.birthdate ? fromISODate(user.birthdate) : null,
    previousVoteCard:
      user && user.voteCard ? voteCardMask(user.voteCard) : null,
    voteCardIdFromTSE: voteCardMask(getSearchedVoteCardId(state)),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(navigate("plipsNav"));
  },
  onSave: ({ birthdate, name, voteCard }) => {
    dispatch(
      profileUpdate({
        birthdate: toISODate(birthdate),
        name,
        voteIdCard: extractNumbers(voteCard),
      }),
    );
  },
  onOpenURL: (url) => dispatch(openURL(url)),
  onTSERequested: ({ birthdate, name }) =>
    dispatch(navigate("tse", { birthdate, name })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileSignUpLayout);
