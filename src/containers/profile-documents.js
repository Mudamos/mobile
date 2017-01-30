import { connect } from "react-redux";

import ProfileDocumentsLayout from "../components/profile-documents-layout";

import { extractNumbers, fromISODate } from "../utils";

import {
  navigate,
  saveProfileDocuments,
} from "../actions";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

const TSE_URL = "http://apps.tse.jus.br/saae/consultaNomeDataNascimento.do";

const webViewProps = user => ({
  source: { uri: TSE_URL },
  injectedJavaScript: `
    (function() {
      var nameField = document.getElementsByName("nomeEleitor")[0];
      var birthField = document.getElementsByName("dataNascimento")[0];

      if (!nameField.value) nameField.value = "${user.name}";
      if (!birthField.value) birthField.value = "${fromISODate(user.birthdate)}";
    })();
  `,
});

const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    currentUser: user,
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
  onTSERequested: currentUser => dispatch(navigate("webView", webViewProps(currentUser))),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  onTSERequested: () => dispatchProps.onTSERequested(stateProps.currentUser),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProfileDocumentsLayout);
