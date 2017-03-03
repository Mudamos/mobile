import Config from "react-native-config";
import { connect } from "react-redux";

import ProfileDocumentsLayout from "../components/profile-documents-layout";

import {
  cpfMask,
  extractNumbers,
  voteCardMask,
} from "../utils";

import {
  navigate,
  openURL,
  saveProfileDocuments,
} from "../actions";

import {
  currentUser,
  getSearchedVoteCardId,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";

const TERMS_OF_USE_URL = Config.MUDAMOS_WEB_API_URL + "/institucional/termos-de-uso";

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
  onSave: ({ cpf, voteCard, termsAccepted }) =>
    dispatch(saveProfileDocuments({
      cpf: extractNumbers(cpf),
      voteCard: extractNumbers(voteCard),
      termsAccepted,
    })),
  onTSERequested: () => dispatch(navigate("tse")),
  onTermsRequested: () => dispatch(openURL(TERMS_OF_USE_URL)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ProfileDocumentsLayout);
