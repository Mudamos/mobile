import { connect } from "react-redux";

import ProfileDocumentsLayout from "../components/profile-documents-layout";

import { extractNumbers } from "../utils";

import {
  saveProfileDocuments,
  openURL,
} from "../actions";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

const TSE_URL = "http://www.tse.jus.br/eleitor/servicos/situacao-eleitoral/consulta-por-nome";

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
  onTSERequested: () => dispatch(openURL(TSE_URL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDocumentsLayout);
