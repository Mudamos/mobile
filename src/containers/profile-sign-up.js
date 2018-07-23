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
  setTempBirthdate,
  setTempName,
  signingUp,
} from "../actions";

import {
  extractNumbers,
  fromISODate,
  toISODate,
  voteCardMask,
} from "../utils";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    errors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
    previousName: user ? user.name : null,
    previousBirthdate: user && user.birthdate ? fromISODate(user.birthdate) : null,
    previousVoteCard: user && user.voteCard ? voteCardMask(user.voteCard) : null,
    searchedVoteCardId: voteCardMask(getSearchedVoteCardId(state)),
  };
};

const mapDispatchToProps = dispatch => ({
  onBack: () => {
    dispatch(clearProfileSaveErrors());
    dispatch(signingUp(false));
    dispatch(navigate("plipsNav"));
  },
  onSave: ({ birthdate, name, voteCard }) => {
    dispatch(profileUpdate({
      birthdate: toISODate(birthdate),
      name,
      voteIdCard: extractNumbers(voteCard),
    }))
  },
  onOpenURL: url => dispatch(openURL(url)),
  onSetTempTSEValues: ({ birthdate, name }) => {
    dispatch(setTempName({ name }));
    dispatch(setTempBirthdate({ birthdate }));
  },
  onSigningUp: () => dispatch(signingUp(true)),
  onTSERequested: () => dispatch(navigate("tse")),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSignUpLayout);
