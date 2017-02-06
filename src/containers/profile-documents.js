import { connect } from "react-redux";

import ProfileDocumentsLayout from "../components/profile-documents-layout";

import {
  cpfMask,
  extractNumbers,
  voteCardMask,
} from "../utils";

import {
  navigate,
  saveProfileDocuments,
} from "../actions";

import {
  currentUser,
  getSearchedVoteCardId,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    currentUser: user,
    previousCpf: user ? cpfMask(user.cpf) : null,
    previousVoteCard: user ? voteCardMask(user.voteCard) : null,
    errors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
    searchedVoteCardId: voteCardMask(getSearchedVoteCardId(state)),
  };
};

const mapDispatchToProps = dispatch => ({
  onSave: ({ cpf, voteCard }) =>
    dispatch(saveProfileDocuments({
      cpf: extractNumbers(cpf),
      voteCard: extractNumbers(voteCard),
    })),
  onTSERequested: () => dispatch(navigate("tse")),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfileDocumentsLayout);
