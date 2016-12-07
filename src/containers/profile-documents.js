import { connect } from "react-redux";

import ProfileDocumentsLayout from "../components/profile-documents-layout";

import { extractNumbers } from "../utils";

import {
  saveProfileDocuments,
} from "../actions";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";



const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    previousCpf: user ? user.cpf : null,
    previousVoteCard: user ? user.voteCard : null,
    errors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onSave: ({ cpf, voteCard }) =>
    dispatch(saveProfileDocuments({
      cpf: extractNumbers(cpf),
      voteCard: extractNumbers(voteCard),
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDocumentsLayout);
