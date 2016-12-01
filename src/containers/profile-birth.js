import { connect } from "react-redux";

import ProfileBirthLayout from "../components/profile-birth-layout";

import { toISODate } from "../utils";

import { saveProfileBirthdate } from "../actions";

import {
  isSavingProfile,
  profileSaveErrors,
} from "../selectors";


const mapStateToProps = state => ({
  errors: profileSaveErrors(state),
  isSaving: isSavingProfile(state),
});

const mapDispatchToProps = dispatch => ({
  onSave: birthdate => dispatch(saveProfileBirthdate(toISODate(birthdate))),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBirthLayout);
