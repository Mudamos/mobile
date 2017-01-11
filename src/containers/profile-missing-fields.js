import { connect } from "react-redux";

import MissingFieldsLayout from "../components/profile-missing-fields-layout";

import {
  profileSaveMain,
} from "../actions";

import {
  currentUser,
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => {
  const user = currentUser(state);

  return {
    errors: profileSaveErrors(state),
    isSaving: isSavingProfile(state),
    previousName: user ? user.name : null,
    showEmail: !user || !user.email,
  };
};

const mapDispatchToProps = dispatch => ({
  onSave: ({ name, email }) => dispatch(profileSaveMain({ name, email })),
});

export default connect(mapStateToProps, mapDispatchToProps)(MissingFieldsLayout);
